using System;
using System.Collections.Generic;

namespace InventoryService.Core.Models
{
    public partial class OsStItemcategories
    {
        public OsStItemcategories()
        {
            OsStFlowmaster = new HashSet<OsStFlowmaster>();
            OsStItems = new HashSet<OsStItems>();
            OsStItemsubcategories = new HashSet<OsStItemsubcategories>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<OsStFlowmaster> OsStFlowmaster { get; set; }
        public ICollection<OsStItems> OsStItems { get; set; }
        public ICollection<OsStItemsubcategories> OsStItemsubcategories { get; set; }
    }
}
