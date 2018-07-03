using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class CustomersWithItemsResource
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CustomerCategory { get; set; }
        public string BranchName { get; set; }
        public ICollection<ItemResource> Items { get; set; }

        public CustomersWithItemsResource()
        {
            Items = new Collection<ItemResource>();
        }
    }
}
