using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class AllItemsResource
    {
        public int CompanyId { get; set; }
        public string  Company { get; set; }
        public string CustomerName { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string  Category { get; set; }
        public string SubCategory { get; set; }
        public string Status { get; set; }
    }
}
