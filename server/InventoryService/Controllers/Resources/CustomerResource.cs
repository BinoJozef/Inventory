using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class CustomerResource
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CustomerCategory { get; set; }
        public string BranchName { get; set; }

    }
}
