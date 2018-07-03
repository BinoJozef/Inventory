
using InventoryService.Controllers.Resources;
using InventoryService.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Core
{
    public interface IFlowRepository
    {
        Task<int> GetMaxSn(int masterId);
        Task<OsStFlowmaster> GetFlowMasterForOrder(int masterId, bool includeRelated);
        Task<OsStFlowmaster> GetFlowMasterForTransfer(int masterId, bool includeRelated);
        Task<OsStFlowmaster> GetFlowMaster(int masterId, bool includeRelated);
        void AddMaster(OsStFlowmaster order);
        void RemoveMaster(OsStFlowmaster order);
        void AddLine(OsStFlowlines order);
        Task<OsStItems> UpdateItemForFlow(string itemCode,byte companyId);
        Task<bool> CheckOrder(int masterId, byte sequenceNumber);
        Task<IEnumerable<AppealResource>> GetUserAppeals(byte seqNumber,int userId,int companyId);
        Task<IEnumerable<NeededAprovesResource>> GetNeededAproves(byte seqNum);
        Task<IEnumerable<AppealResource>> GetUserAppealsBySupervisor(byte seqNumber, int userId, int companyId,string supCode);
        Task<PrintResource> GetPrintResource(int masterId);




    }
}
