using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryService.Persistence;
using AutoMapper;
using System.Collections;
using InventoryService.Controllers.Resources;
using Microsoft.EntityFrameworkCore;
using InventoryService.Core.Models;
using Microsoft.AspNetCore.Authorization;

namespace InventoryService.Controllers
{
    [Authorize]
    public class ItemsController : Controller
    {
        private readonly ONSALEDBContext _context;
        private readonly IMapper _mapper;
        public ItemsController(ONSALEDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("/api/items/{companyId}/{subCatId}")]
        public async Task<IEnumerable<ItemResource>> GetItems(int companyId, int subCatId)
        {
            var items = await _context.OsStItems.Where(i => i.CompanyId == companyId && i.SubCategoryId == subCatId && i.StatusId == 4).ToListAsync();

            return _mapper.Map<List<OsStItems>, List<ItemResource>>(items);
        }

        [HttpGet("/api/items/stock/{companyId}/{subCatId}")]
        public async Task<int> GetStock(int companyId, int subCatId)
        {
            var freeSubCatCount = await _context.OsStItems.Where(i => i.CompanyId == companyId && i.SubCategoryId == subCatId && i.StatusId == 4).CountAsync();

            var InProgressSubCatCount = await _context.OsStFlowmaster.Where(m => m.CompanyId == companyId && m.SubCategoryId == subCatId && m.StatusId == 5 && m.FlowTypeId == 1).CountAsync();

            int stock = freeSubCatCount - InProgressSubCatCount;
            if (stock < 0)
                return 0;
            return stock;
        }

        [HttpGet("/api/items")]
        public async Task<IEnumerable<AllItemsResource>> GetAllItems()
        {
            var items = _context.OsStItems
               .Include(i => i.Company)
               .Include(i => i.Category)
               .Include(i => i.SubCategory)
               .Include(i => i.Status);

            var nİtems = await (from a in items
                          join c in _context.OsStCustomers
                     on new { A = a.AssignedTo, B = (byte)a.CompanyId } equals new { A = c.Code, B = c.CompanyId } into custm
                          from m in custm.DefaultIfEmpty()
                          select new AllItemsResource()
                          {
                              Category = a.Category == null ? "" : a.Category.Name,
                              Code = a.Code,
                              Name = a.Name,
                              CompanyId = a.CompanyId,
                              Company = a.Company.Companyname,
                              CustomerName = m == null ? "Boş" : m.Name,
                              Status = a.Status == null ? "":a.Status.StatusName,
                              SubCategory = a.SubCategory == null ? "" : a.SubCategory.Name,
                          }).ToListAsync();

            return nİtems;

            //return _mapper.Map<List<OsStItems>, List<AllItemsResource>>(items);


           // return await _context.OsStItems.Where(i => i.CompanyId == companyId && i.SubCategoryId == subCatId && i.StatusId == 4).CountAsync();
        }

        [HttpPost("/api/items/update")]
        public IActionResult UpdateItems([FromBody] List<UpdateItemResource> updatedItems)
        {
           
            foreach (var upitem in updatedItems)
            {
               var item= _context.OsStItems.Where(i => i.CompanyId == upitem.CompanyId && i.Code == upitem.Code).SingleOrDefault();
                item.CategoryId = upitem.CategoryId;
                item.SubCategoryId = upitem.SubCategoryId;
                item.StatusId = upitem.StatusId;
                 
            }
            _context.SaveChanges();

            return Ok(updatedItems);


        }

        [HttpGet("/api/items/freeInventories")]
        public async Task<IEnumerable<int>> GetAllFreeInventories()
        {
            //var count = await _context.OsStItems.Where(i=>i.StatusId==4).OrderBy(i => i.CompanyId).GroupBy(
            //    c => c.CompanyId).Select(group => group.Count()).ToListAsync();
            var count = new int[3];
            int vCount = await _context.OsStItems.Where(i => i.StatusId == 4 && i.CompanyId == 1).CountAsync();
            int tCount= await _context.OsStItems.Where(i => i.StatusId == 4 && i.CompanyId == 3).CountAsync();
            int hCount=await _context.OsStItems.Where(i => i.StatusId == 4 && i.CompanyId == 4).CountAsync();
            count[0] = vCount;
            count[1] = tCount;
            count[2] = hCount;
            return count;
       
        }

        [HttpGet("/api/items/assignedInventories")]
        public async Task<IEnumerable<int>> GetAllAssignedInventories()
        {
            //var count = await _context.OsStItems.Where(i => i.StatusId == 6).OrderBy(i => i.CompanyId).GroupBy(
            //    c => c.CompanyId).Select(group => group.Count()).ToListAsync();
            var count = new int[3];
            int vCount = await _context.OsStItems.Where(i => i.StatusId == 6 && i.CompanyId == 1).CountAsync();
            int tCount = await _context.OsStItems.Where(i => i.StatusId == 6 && i.CompanyId == 3).CountAsync();
            int hCount = await _context.OsStItems.Where(i => i.StatusId == 6 && i.CompanyId == 4).CountAsync();
            count[0] = vCount;
            count[1] = tCount;
            count[2] = hCount;
            return count;

        }
    }
}