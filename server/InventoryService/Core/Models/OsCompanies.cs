using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Core.Models
{
    public partial class OsCompanies
    {
        public OsCompanies()
        {
            OsStFlowmaster = new HashSet<OsStFlowmaster>();
            OsStItems = new HashSet<OsStItems>();
        }

        public int Id { get; set; }
        public string Companyname { get; set; }
        public string Companyip { get; set; }
        public string Companycode { get; set; }
        public string Firmnr { get; set; }
        public string Lang { get; set; }
        public string Linkedsrv { get; set; }

        public ICollection<OsStFlowmaster> OsStFlowmaster { get; set; }
        public ICollection<OsStItems> OsStItems { get; set; }
    }
}
