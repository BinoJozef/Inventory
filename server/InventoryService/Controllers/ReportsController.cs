using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryService.Persistence;
using AutoMapper;
using InventoryService.Controllers.Resources;
using Microsoft.EntityFrameworkCore;
using InventoryService.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace InventoryService.Controllers
{
    [Authorize]
    public class ReportsController : Controller
    {
        private readonly ONSALEDBContext _context;
        private readonly IMapper _mapper;
        public ReportsController(ONSALEDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("/api/reports/inventoryReport/{companyId}")]
        public async Task<IEnumerable<InventoryReportResource>> GetInventoryReport(byte companyId)
        {


            var inventarReport = await (from items in _context.OsStItems.Include(i => i.Company).Include(i => i.Category).Include(i => i.SubCategory)
                                        join cust in _context.OsStCustomers
                                on items.AssignedTo equals cust.Code
                                        where items.CompanyId==companyId && cust.CompanyId==companyId

                                        select new InventoryReportResource()
                                        {
                                            Company = items.Company.Companyname,
                                            CustomerBrunch = cust.BranchName,
                                            CustomerName = cust.Name,
                                            CustomerType = cust.CustomerCategory,
                                            CustomerCode=cust.Code,
                                            InvCategory = items.Category.Name,
                                            InvCode = items.Code,
                                            InvSubCategory = items.SubCategory.Name

                                        }).ToListAsync();

            return inventarReport;

        }

    }
}