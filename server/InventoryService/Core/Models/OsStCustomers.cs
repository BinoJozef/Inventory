using System;
using System.Collections.Generic;

namespace InventoryService.Core.Models
{
    public partial class OsStCustomers
    {
        public byte CompanyId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string CustomerCategory { get; set; }
        public string BranchName { get; set; }
        public string Specode5 { get; set; }
    }
}
