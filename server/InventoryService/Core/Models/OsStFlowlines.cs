using System;
using System.Collections.Generic;

namespace InventoryService.Core.Models
{
    public partial class OsStFlowlines
    {
        public int Id { get; set; }
        public int MasterId { get; set; }
        public byte SequenceNumber { get; set; }
        public int ExecutedBy { get; set; }
        public DateTime? ExecutedDate { get; set; }
        public byte StatusId { get; set; }
        public string Note { get; set; }

        public OsStFlowmaster Master { get; set; }
    }
}
