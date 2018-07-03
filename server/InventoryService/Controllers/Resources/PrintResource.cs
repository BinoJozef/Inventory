using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class PrintResource
    {
        public string CustomerCode { get; set; }

        public string CustomerName { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public string CompanyName { get; set; }
    }
}
