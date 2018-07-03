using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class TransferFlowResource
    {
        public int MasterId { get; set; }
        public byte FlowTypeId { get; set; }
        public string CustomerCode { get; set; }
        public int CompanyId { get; set; }
        public string OldCustomerCode { get; set; }
        public string ItemCode { get; set; }
        public byte ReasonId { get; set; }
        public int SequenceNumber { get; set; }//max flowline
        public ICollection<NotesResource> Notes { get; set; }

        public TransferFlowResource()
        {
            Notes = new Collection<NotesResource>();
        }
    }
}
