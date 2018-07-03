using InventoryService.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using InventoryService.Controllers.Resources;
using InventoryService.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryService.Persistence
{
    public class FlowRepository : IFlowRepository
    {
        private readonly ONSALEDBContext _context;
        public FlowRepository(ONSALEDBContext context)
        {
            _context = context;
        }
        public async Task<int> GetMaxSn(int masterId)
        {
            return await _context.OsStFlowlines.Where(l=>l.MasterId==masterId).MaxAsync(m=>m.SequenceNumber);
        }
        public async Task<IEnumerable<AppealResource>> GetUserAppeals(byte seqNumber,int userId,int companyId )
        {

            var linesMaxDate= _context.OsStFlowlines.Where(sn=>sn.SequenceNumber==seqNumber).GroupBy(l => l.MasterId).Select(group => new { MasterId = group.Key, Mx = group.Max(d => d.ExecutedDate) }).ToList();

            var orderedlines = (from t in linesMaxDate
                              join t1 in _context.OsStFlowlines on new {A= t.MasterId, B=t.Mx } equals new { A=t1.MasterId,B= t1.ExecutedDate }
                              select new { MasterId = t1.MasterId,UserId=t1.ExecutedBy,ExecDate=t1.ExecutedDate }).Distinct().ToList();


            var userAppeals = await (from a in _context.OsStFlowmaster.Include(c => c.Category).Include(s => s.Status).Include(t=>t.FlowType)
                                     where a.CompanyId == companyId
                                     join b in orderedlines on a.Id equals b.MasterId
                                  
                                     join c in _context.OsStCustomers  
                                on a.CustomerCode equals c.Code
                                     where c.CompanyId == companyId
                                     orderby (b.UserId==userId ? 1:2),b.ExecDate descending
                                    
                                     //where a.CompanyId == companyId && c.CompanyId == companyId 
                                     select new AppealResource()
                                     {
                                         MasterId = a.Id,
                                         CustomerCode = c.Code,
                                         CustomerName = c.Name,
                                         AppealType = a.FlowType.Name,
                                         CreatedDate = a.CreatedDate.ToString("dd/MM/yyyy"),
                                         UserId=a.CreatedBy,
                                         Category = a.Category.Name,
                                         Status = a.Status.StatusName,
                                         StatusId = a.StatusId,
                                         AppealLines = a.OsStFlowlines.Select(l =>
                                          new FlowLineResource()
                                          {
                                              ExecutedDate = l.ExecutedDate.Value.ToString("dd/MM/yyyy"),
                                              SequenceNumber = l.SequenceNumber,
                                              StatusId = l.StatusId,
                                              UserId = l.ExecutedBy
                                          }).ToList()

                                     }).ToListAsync();

            return userAppeals;
        }
        public async Task<OsStFlowmaster> GetFlowMaster(int masterId, bool includeRelated)
        {
            if (!includeRelated)
                return await _context.OsStFlowmaster.SingleOrDefaultAsync(m => m.Id == masterId);

            return await _context.OsStFlowmaster.Include(m => m.OsStFlowlines).SingleOrDefaultAsync(v => v.Id == masterId);
        }
        public async Task<OsStFlowmaster> GetFlowMasterForTransfer(int masterId, bool includeRelated)
        {
            if (!includeRelated)
                return await _context.OsStFlowmaster.SingleOrDefaultAsync(m => (m.FlowTypeId == 2 || m.FlowTypeId == 3) && m.Id == masterId);

            return await _context.OsStFlowmaster.Include(m => m.OsStFlowlines).SingleOrDefaultAsync(v => v.Id == masterId && (v.FlowTypeId == 2 || v.FlowTypeId == 3));
        }
        public async Task<OsStFlowmaster> GetFlowMasterForOrder(int masterId, bool includeRelated)
        {
            if (!includeRelated)
                return await _context.OsStFlowmaster.SingleOrDefaultAsync(m => m.FlowTypeId == 1 && m.Id == masterId);

            return await _context.OsStFlowmaster.Include(m=>m.OsStFlowlines).SingleOrDefaultAsync(v => v.Id == masterId && v.FlowTypeId==1);

        }
        public async Task<IEnumerable<NeededAprovesResource>> GetNeededAproves(byte seqNum)
        {
            var linesMaxSeqNum = _context.OsStFlowlines.GroupBy(l => l.MasterId).Select(group => new { MasterId = group.Key, Mx = group.Max(d => d.SequenceNumber) }).Where(l => l.Mx == seqNum).Select(l => l.MasterId).ToList();
            if (linesMaxSeqNum.Count == 0 && seqNum!=3)
                return null;

            if (seqNum == 1)//Ticari Marketing
                return await (from a in _context.OsStFlowmaster.Include(m => m.FlowType)
                              where (a.FlowTypeId == 1 || a.FlowTypeId == 2) && a.StatusId == 5
                              join b in linesMaxSeqNum on a.Id equals b

                              select new NeededAprovesResource()
                              {
                                  AppealType = a.FlowType.Name,
                                  CreatedDate = a.CreatedDate.ToString("dd/MM/yyyy"),
                                  MasterId = a.Id


                              }).ToListAsync();
           else if (seqNum == 2)//Marketing
                return await (from a in _context.OsStFlowmaster.Include(m => m.FlowType)
                              where (a.FlowTypeId == 1 || a.FlowTypeId == 2) && a.StatusId == 5
                              join b in linesMaxSeqNum on a.Id equals b

                              select new NeededAprovesResource()
                              {
                                  AppealType = a.FlowType.Name,
                                  CreatedDate = a.CreatedDate.ToString("dd/MM/yyyy"),
                                  MasterId = a.Id


                              }).ToListAsync();
            else if (seqNum == 3)//Techizat
            {
                var returnTypeAppeals = _context.OsStFlowmaster.Where(t => t.FlowTypeId == 3 && t.StatusId == 5).Select(m => m.Id).ToList();//Qaytarma ucun
                return await (from a in _context.OsStFlowmaster.Include(m => m.FlowType)
                              where (a.FlowTypeId == 1 || a.FlowTypeId == 2 || a.FlowTypeId == 3) && a.StatusId == 5
                              join b in linesMaxSeqNum.Concat(returnTypeAppeals) on a.Id equals b

                              select new NeededAprovesResource()
                              {
                                  AppealType = a.FlowType.Name,
                                  CreatedDate = a.CreatedDate.ToString("dd/MM/yyyy"),
                                  MasterId = a.Id


                              }).ToListAsync();
            }
            return null;

        }
        public void AddMaster(OsStFlowmaster order)
        {
            _context.OsStFlowmaster.Add(order);
        }
        public void RemoveMaster(OsStFlowmaster order)
        {
            _context.OsStFlowmaster.Remove(order);
        }
        public void AddLine(OsStFlowlines order)
        {
            _context.OsStFlowlines.Add(order);
        }

        public async Task<OsStItems> UpdateItemForFlow(string itemCode,byte companyId)
        {
            return await _context.OsStItems.FirstAsync(i=>i.Code==itemCode && i.CompanyId==companyId);
        }

        public async Task<bool> CheckOrder(int masterId, byte sequenceNumber)
        {
            return await _context.OsStFlowlines.AnyAsync(l => l.MasterId == masterId && l.SequenceNumber == sequenceNumber);
        }

        public async Task<IEnumerable<AppealResource>> GetUserAppealsBySupervisor(byte seqNumber, int userId, int companyId, string supCode)
        {
            var linesMaxDate = _context.OsStFlowlines.Where(sn => sn.SequenceNumber == seqNumber).GroupBy(l => l.MasterId).Select(group => new { MasterId = group.Key, Mx = group.Max(d => d.ExecutedDate) }).ToList();

            var orderedlines = (from t in linesMaxDate
                                join t1 in _context.OsStFlowlines on new { A = t.MasterId, B = t.Mx } equals new { A = t1.MasterId, B = t1.ExecutedDate }
                                select new { MasterId = t1.MasterId, UserId = t1.ExecutedBy, ExecDate = t1.ExecutedDate }).Distinct().ToList();


            var userAppeals = await(from a in _context.OsStFlowmaster.Include(c => c.Category).Include(s => s.Status).Include(t=>t.FlowType)
                                    where a.CompanyId == companyId
                                    join b in orderedlines on a.Id equals b.MasterId
                                    join c in _context.OsStCustomers
                               on a.CustomerCode equals c.Code
                                    where c.CompanyId == companyId && c.Specode5 == supCode
                                    orderby (b.UserId == userId ? 1 : 2), b.ExecDate descending

                                    //where c.CompanyId == companyId && c.Specode5 == supCode
                                    select new AppealResource()
                                    {
                                        MasterId = a.Id,
                                        CustomerCode = c.Code,
                                        CustomerName = c.Name,
                                        AppealType = a.FlowType.Name,
                                        CreatedDate = a.CreatedDate.ToString("dd/MM/yyyy"),
                                        UserId = a.CreatedBy,
                                        Category = a.Category.Name,
                                        Status = a.Status.StatusName,
                                        StatusId = a.StatusId,
                                        AppealLines = a.OsStFlowlines.Select(l =>
                                         new FlowLineResource()
                                         {
                                             ExecutedDate = l.ExecutedDate.Value.ToString("dd/MM/yyyy"),
                                             SequenceNumber = l.SequenceNumber,
                                             StatusId = l.StatusId,
                                             UserId = l.ExecutedBy
                                         }).ToList()

                                    }).ToListAsync();

            return userAppeals;
        }
        public async Task<PrintResource> GetPrintResource(int masterId)
        {
            //join c in _context.OsStCustomers
            //         on new { A = a.AssignedTo, B = (byte)a.CompanyId } equals new { A = c.Code, B = c.CompanyId } into custm
            //              from m in custm.DefaultIfEmpty()
            var printRes = await (from a in _context.OsStFlowmaster.Include(c => c.Company)
                                  where a.Id == masterId
                                  join c in _context.OsStCustomers
                             on a.CustomerCode equals c.Code
                                  where c.CompanyId == a.CompanyId
                                  join d in _context.OsStItems
                                  on a.FinalItemCode equals d.Code
                                  where d.CompanyId == a.CompanyId

                                  //where a.CompanyId == companyId && c.CompanyId == companyId 
                                  select new PrintResource()
                                  {
                                      CustomerCode = c.Code,
                                      CustomerName = c.Name,
                                      ItemCode = d.Code,
                                      ItemName = d.Name,
                                      CompanyName = a.Company.Companyname

                                  }).SingleOrDefaultAsync();
            return printRes;
        }


    }
}
