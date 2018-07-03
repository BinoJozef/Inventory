using InventoryService.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Persistence
{
    public class UnitOfWork:IUnitOfWork
    {
        private readonly ONSALEDBContext _context;
        public UnitOfWork(ONSALEDBContext context)
        {
            _context = context;
        }

        public async Task CompleteAsync()
        {
           
            await  _context.SaveChangesAsync();
        }
    }
}
