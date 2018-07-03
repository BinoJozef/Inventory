using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class CategoryResource:KeyValuePairResource
    {
        public ICollection<KeyValuePairResource> SubCategories { get; set; }

        public CategoryResource()
        {
            SubCategories = new Collection<KeyValuePairResource>();
        }
    }
}
