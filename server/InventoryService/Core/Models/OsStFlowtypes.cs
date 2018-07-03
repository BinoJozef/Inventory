using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Core.Models
{
    public partial class OsStFlowtypes
    {
        public OsStFlowtypes()
        {
            OsStFlowmaster = new HashSet<OsStFlowmaster>();
        }

        public byte Id { get; set; }
        public string Name { get; set; }

        public ICollection<OsStFlowmaster> OsStFlowmaster { get; set; }
    }
}
