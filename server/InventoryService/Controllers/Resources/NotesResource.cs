using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class NotesResource
    {
        public int ProfessionId { get; set; }
        public string Note { get; set; }
        public int UserId { get; set; }
    }
}
