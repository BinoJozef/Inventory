using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Controllers.Resources
{
    public class OrderFlowResource
    {
        public int MasterId { get; set; }
        public string CustomerCode { get; set; }
        public int  CompanyId { get; set; }
        public int CategoryId { get; set; }
        public int SubCategoryId { get; set; }
        public int SequenceNumber { get; set; }//max flowline
        public ICollection<NotesResource> Notes { get; set; }

        public OrderFlowResource()
        {
            Notes = new Collection<NotesResource>();
        }

    }
}
