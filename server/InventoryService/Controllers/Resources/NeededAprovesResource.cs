using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class NeededAprovesResource
    {
        public int MasterId { get; set; }
        public string AppealType { get; set; }
        public string CreatedDate { get; set; }
    }
}
