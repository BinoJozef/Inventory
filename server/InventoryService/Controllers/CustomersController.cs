using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections;
using InventoryService.Persistence;
using AutoMapper;
using InventoryService.Controllers.Resources;
using Microsoft.EntityFrameworkCore;
using InventoryService.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace InventoryService.Controllers
{
    [Authorize]
    public class CustomersController : Controller
    {
        private readonly ONSALEDBContext _context;
        private readonly IMapper _mapper;
        public CustomersController(ONSALEDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        [HttpGet("api/customers/count/{companyid}")]
        public async Task<int> GetCustomersCount(int companyId)
        {
            var custCount = await _context.OsStCustomers.Where(c => c.CompanyId == companyId).CountAsync();
            return custCount;
        }
        [HttpGet("api/customersbysupcode/{companyid}/{supcode}")]
        public async Task<IEnumerable<CustomerResource>> GetCustomersBySupervisorCode(int companyId,string supcode)
        {
            var customersBySupCode = await _context.OsStCustomers.Where(c => c.CompanyId == companyId && c.Specode5 == supcode).ToListAsync();
            return _mapper.Map<List<OsStCustomers>, List<CustomerResource>>(customersBySupCode);
        }

        [HttpGet("api/customers/{companyid}/{skipsize}/{takesize}")]
        public async Task<IEnumerable<CustomerResource>> GetCustomers(int companyId,int skipSize,int takeSize )
        {
            

            var customers = await _context.OsStCustomers.Where(c => c.CompanyId == companyId).Skip(skipSize).Take(takeSize).ToListAsync();

            return _mapper.Map<List<OsStCustomers>, List<CustomerResource>>(customers);

        }
        [HttpGet("api/customer/{companyid}/{customerCode}")]
        public async Task<IEnumerable<CustomerResource>> GetCustomer(int companyId, string customerCode)
        {
            var customers = await _context.OsStCustomers.Where(c => c.CompanyId == companyId && c.Code == customerCode).ToListAsync();

            return _mapper.Map<List<OsStCustomers>, List<CustomerResource>>(customers);

        }


        [HttpGet("api/customersForTransferForm/{companyId}/{oldCustomerCode}/{customerCode}/{invCode}")] //transfer form
        public async Task<IActionResult> GetCustomersForTransferForm(int companyId, string oldCustomerCode , string customerCode,string invCode)
        {
          
            var item = _context.OsStItems.Where(i => i.CompanyId == companyId && i.StatusId != 4 && i.AssignedTo==oldCustomerCode && i.Code==invCode).Select(c => new { Code = c.Code, Name = c.Name, AssignedTo = c.AssignedTo }).ToList();
           
            var customersWithItems = await _context.OsStCustomers.Where(c => c.CompanyId == companyId && (c.Code == customerCode || c.Code == oldCustomerCode)).Select(c => new CustomersWithItemsResource()
            {
                BranchName = c.BranchName,
                Name = c.Name,
                Code = c.Code,
                CustomerCategory = c.CustomerCategory,
                Items = item.Where(i => i.AssignedTo == c.Code).Select(i => new ItemResource()
                {
                    Code = i.Code,
                    Name = i.Name 
                }).ToList()
            }).ToListAsync();

            return Ok(customersWithItems);


        }

        [HttpGet("api/customerForReturnForm/{companyId}/{oldCustomerCode}/{invCode}")] //return form
        public async Task<IActionResult> GetCustomersForReturnForm(int companyId, string oldCustomerCode,string invCode) 
        {
            var item = _context.OsStItems.Where(i => i.CompanyId == companyId && i.StatusId != 4 && i.AssignedTo == oldCustomerCode && i.Code == invCode).Select(c => new { Code = c.Code, Name = c.Name, AssignedTo = c.AssignedTo }).ToList();
          
            var customerWithItems = await _context.OsStCustomers.Where(c => c.CompanyId == companyId &&  c.Code == oldCustomerCode).Select(c => new CustomersWithItemsResource()
            {
                BranchName = c.BranchName,
                Name = c.Name,
                Code = c.Code,
                CustomerCategory = c.CustomerCategory,
                Items = item.Where(i => i.AssignedTo == c.Code).Select(i => new ItemResource()
                {
                    Code = i.Code,
                    Name = i.Name
                }).ToList()
            }).ToListAsync();

            return Ok(customerWithItems);


        }
        [HttpGet("api/customerswithitemsbysupcode/{companyId}/{supCode}")]
        public async Task<IEnumerable<CustomersWithItemsResource>> GetCustomersWithItemsBySupCode(int companyId,string supCode)
        {
            var items = _context.OsStItems.Where(i => i.CompanyId == companyId &&i.StatusId != 4).Select(c => new { Code = c.Code,Name=c.Name, AssignedTo = c.AssignedTo }).ToList();

            var customersWithItems = await _context.OsStCustomers.Where(c => c.CompanyId == companyId && c.Specode5 == supCode).Select(c => new CustomersWithItemsResource()
            {
                 BranchName=c.BranchName,
                  Name=c.Name,
                   Code=c.Code,
                    CustomerCategory=c.CustomerCategory,
                     Items=items.Where(i=>i.AssignedTo==c.Code).Select(i=>new ItemResource()
                     {
                          Code=i.Code,
                          Name=i.Name
                     }).ToList()
            }).ToListAsync();

            return customersWithItems;
            
           
        }


    }
}
