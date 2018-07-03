using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using InventoryService.Core.Models;
using InventoryService.Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using InventoryService.Controllers.Resources;
using Microsoft.AspNetCore.Authorization;

namespace InventoryService.Controllers
{
    [Authorize]
    public class CategoriesController : Controller
    {
        private readonly ONSALEDBContext _context;
        private readonly IMapper _mapper;
        public CategoriesController(ONSALEDBContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("/api/categories")]
        public async Task<IEnumerable<CategoryResource>> GetCategories()
        {
            var categories= await _context.OsStItemcategories.Include(s=>s.OsStItemsubcategories).ToListAsync();

            return _mapper.Map<List<OsStItemcategories>, List<CategoryResource>>(categories);
        }
        [HttpPost("/api/categories/add")]
        public async Task<IActionResult> AddCategory([FromBody]CategoryResource category)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var check = await _context.OsStItemcategories.AnyAsync(i => i.Name == category.Name);
            if (check)
                return BadRequest("Bu adlı kateqoriya artıq mövcuddur!");
            var cat= _mapper.Map<CategoryResource, OsStItemcategories>(category);

            _context.OsStItemcategories.Add(cat);

            await _context.SaveChangesAsync();

            var categories = await _context.OsStItemcategories.Include(s => s.OsStItemsubcategories).ToListAsync();

            return Ok(_mapper.Map<List<OsStItemcategories>, List<CategoryResource>>(categories));

        }

        [HttpPost("/api/subCategories/add")]
        public async Task<IActionResult> AddSubCategory([FromBody]OsStItemsubcategories subCategory)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var check = await _context.OsStItemsubcategories.AnyAsync(i => i.Name == subCategory.Name && i.CatId==subCategory.CatId);
            if (check)
                return BadRequest("Bu adlı alt kateqoriya artıq mövcuddur!");

            _context.OsStItemsubcategories.Add(subCategory);

            await _context.SaveChangesAsync();

            var categories = await _context.OsStItemcategories.Include(s => s.OsStItemsubcategories).ToListAsync();

            return Ok(_mapper.Map<List<OsStItemcategories>, List<CategoryResource>>(categories));

        }

        [HttpDelete("/api/categories/delete/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var cat = await _context.OsStItemcategories.Include(x=>x.OsStItemsubcategories).Include(x=>x.OsStItems).Include(x=>x.OsStFlowmaster).SingleOrDefaultAsync(x =>x.Id==id);

            if (cat == null)
                return NotFound();
            try
            {
                _context.OsStItemcategories.Remove(cat);
                await _context.SaveChangesAsync();
            }
            catch (InvalidOperationException ex)
            {
                
                return BadRequest("Bu kateqoriyada inventarlar mövcuddur!Kateqoriya bağlı olduğu maldan silindikdən sonra bu əməliyyatı yerinə yetirə bilərsiniz!");
            }
            catch(Exception ex)
            {
                return BadRequest("Sistem Xətası!");
            }
            

            var categories = await _context.OsStItemcategories.Include(s => s.OsStItemsubcategories).ToListAsync();

            return Ok(_mapper.Map<List<OsStItemcategories>, List<CategoryResource>>(categories));
     
        }
        [HttpDelete("/api/subcategories/delete/{catId}/{subCatId}")]
        public async Task<IActionResult> DeleteSubCategory(int catId,int subCatId)
        {
            var cat = await _context.OsStItemsubcategories.Include(sc=>sc.OsStFlowmaster).Include(sc=>sc.OsStItems).SingleOrDefaultAsync(x => x.Id == subCatId && x.CatId==catId);

            if (cat == null)
                return NotFound();
            try
            {
                _context.OsStItemsubcategories.Remove(cat);
            await _context.SaveChangesAsync();
            }
            catch (InvalidOperationException ex)
            {

                return BadRequest("Bu alt kateqoriyada inventarlar mövcuddur!Kateqoriya bağlı olduğu maldan silindikdən sonra bu əməliyyatı yerinə yetirə bilərsiniz!");
            }
            catch (Exception ex)
            {
                return BadRequest("Sistem Xətası!");
            }

            var categories = await _context.OsStItemcategories.Include(s => s.OsStItemsubcategories).ToListAsync();

            return Ok(_mapper.Map<List<OsStItemcategories>, List<CategoryResource>>(categories));

        }



    }
}