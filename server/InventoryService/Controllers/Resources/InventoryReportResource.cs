using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class InventoryReportResource
    {
        public string Company { get; set; }
        public string CustomerBrunch { get; set; }
        public string CustomerName { get; set; }
        public string CustomerType { get; set; }
        public string CustomerCode { get; set; }
        public string InvCode { get; set; }
        public string InvCategory { get; set; }
        public string InvSubCategory { get; set; }

    }
}
