using System;
using System.Collections.Generic;

namespace InventoryService.Core.Models
{
    public partial class OsStItems
    {
        public int CompanyId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public string AssignedTo { get; set; }
        public byte StatusId { get; set; }

        public OsStItemcategories Category { get; set; }
        public OsCompanies Company { get; set; }
        public OsStStatus Status { get; set; }
        public OsStItemsubcategories SubCategory { get; set; }
    }
}
