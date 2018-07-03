using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class AppealResource
    {
        public int MasterId { get; set; }
        public string CustomerCode { get; set; }
        public string AppealType { get; set; }
        public string CustomerName { get; set; }
        public string Category { get; set; }
        public int StatusId { get; set; }
        public string Status { get; set; }
        public string CreatedDate { get; set; }
        public int UserId { get; set; }
        public ICollection<FlowLineResource> AppealLines { get; set; }
       
    }
}
