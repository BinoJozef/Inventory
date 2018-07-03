using System;
using System.Collections.Generic;

namespace InventoryService.Core.Models
{
    public partial class OsStFlowmaster
    {
        public OsStFlowmaster()
        {
            OsStFlowlines = new HashSet<OsStFlowlines>();
        }

        public int Id { get; set; }
        public int CompanyId { get; set; }
        public byte FlowTypeId { get; set; }
        public string CustomerCode { get; set; }
        public string OldCustomerCode { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string FinalItemCode { get; set; }
        public byte StatusId { get; set; }
        public byte? ReasonId { get; set; }

        public OsStItemcategories Category { get; set; }
        public OsCompanies Company { get; set; }
        public OsStFlowtypes FlowType { get; set; }
        public OsStStatus Status { get; set; }
        public OsStItemsubcategories SubCategory { get; set; }
        public ICollection<OsStFlowlines> OsStFlowlines { get; set; }
    }
}
