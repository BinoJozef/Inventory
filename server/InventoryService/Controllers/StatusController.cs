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
    public class StatusController : Controller
    {
        private readonly ONSALEDBContext _context;
        private readonly IMapper _mapper;
        public StatusController(ONSALEDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("/api/itemStatus")]
        public async Task<IEnumerable<KeyValuePairResource>> GetItemStatus()
        {
            var status = await _context.OsStStatus.Where(s => s.TypeId == 2).ToListAsync();

            return _mapper.Map<List<OsStStatus>, List<KeyValuePairResource>>(status);
        }

        [HttpGet("/api/reasonStatus")]
        public async Task<IEnumerable<KeyValuePairResource>> GetReasonStatus()
        {
            var status = await _context.OsStStatus.Where(s => s.TypeId == 3).ToListAsync();

            return _mapper.Map<List<OsStStatus>, List<KeyValuePairResource>>(status);
        }



    }
}