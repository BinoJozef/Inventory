using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Core.Models
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string MarketingMail { get; set; }
        public string OutfitMail { get; set; }
        public string CommercialMarketingMail { get; set; }
    }
}
