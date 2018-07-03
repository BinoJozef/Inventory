using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class UpdateItemResource
    {
        public int CompanyId { get; set; }
        public string Code { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }
        public byte StatusId { get; set; }
    }
}
