using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class SaveOrderFlowResource
    {
        public int MasterId { get; set; }
        public byte CompanyId { get; set; }
        public byte FlowTypeId { get; set; }
        public string CustomerCode { get; set; }
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        public int UserId { get; set; }
        public string ItemCode { get; set; }
        public byte StatusId { get; set; }
        //lines
        public byte SequenceNumber { get; set; }
        public string Note { get; set; }
    }
}
