using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class FlowLineResource
    {
       
        public string ExecutedDate { get; set; }
        public byte SequenceNumber { get; set; }
        public byte StatusId { get; set; }
        public int UserId { get; set; }
        
    }
}
