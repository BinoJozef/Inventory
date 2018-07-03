using System;
using System.Collections.Generic;

namespace InventoryService.Core.Models
{
    public partial class OsStStatus
    {
        public OsStStatus()
        {
            OsStFlowmaster = new HashSet<OsStFlowmaster>();
            OsStItems = new HashSet<OsStItems>();
        }

        public byte Id { get; set; }
        public byte TypeId { get; set; }
        public string StatusName { get; set; }

        public ICollection<OsStFlowmaster> OsStFlowmaster { get; set; }
        public ICollection<OsStItems> OsStItems { get; set; }
    }
}
