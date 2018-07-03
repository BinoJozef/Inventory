using System;
using System.Collections.Generic;

namespace InventoryService.Core.Models
{
    public partial class OsStItemsubcategories
    {
        public OsStItemsubcategories()
        {
            OsStFlowmaster = new HashSet<OsStFlowmaster>();
            OsStItems = new HashSet<OsStItems>();
        }

        public int Id { get; set; }
        public int CatId { get; set; }
        public string Name { get; set; }

        public OsStItemcategories Cat { get; set; }
        public ICollection<OsStFlowmaster> OsStFlowmaster { get; set; }
        public ICollection<OsStItems> OsStItems { get; set; }
    }
}
