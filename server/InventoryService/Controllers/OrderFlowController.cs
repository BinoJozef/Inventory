using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using InventoryService.Core;
using InventoryService.Core.Models;
using InventoryService.Controllers.Resources;
using InventoryService.Helpers;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace InventoryService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class OrderFlowController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IFlowRepository _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        public OrderFlowController(IMapper mapper, IFlowRepository repository,IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _mapper = mapper;
            _repository = repository;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

        [HttpGet("getOrder/{masterId}")]
        public async Task<IActionResult> GetOrder(int masterId)
        {
            var flowMaster = await _repository.GetFlowMasterForOrder(masterId,true); //false olmalidi

            if (flowMaster == null)
                return NotFound();
            else if (flowMaster.StatusId == 3)
                return BadRequest("Sifariş imtina edilmişdir!");

            var maxSn = await _repository.GetMaxSn(masterId);

            var orderResource = _mapper.Map<OsStFlowmaster, OrderFlowResource>(flowMaster);
            orderResource.SequenceNumber = maxSn;

             return Ok(orderResource);
        }
        [HttpGet("getNeededApproves/{seqNum}")]
        public async Task<IActionResult> GetNeededApproves(byte seqNum)
        {

           var neededApproves= await _repository.GetNeededAproves(seqNum);
            if (neededApproves == null)
                return BadRequest("Əməliyyat tapılmadı!");
            return Ok(neededApproves);

        }
        [HttpGet("getAppeals/{seqNum}/{userId}/{companyId}")]
        public async Task<IActionResult> GetUserAppeals(byte seqNum,int userId,int companyId)
        {
            
            var userAppeals = await _repository.GetUserAppeals(seqNum,userId,companyId);
            //if (userAppeals.Count()==0)
            //    return BadRequest("Hec bir muraciet yoxdur");
            return Ok(userAppeals);

        }
        [HttpGet("getAppealsBySupervisor/{seqNum}/{userId}/{companyId}/{supCode}")]
        public async Task<IActionResult> GetUserAppealsBySupervisor(byte seqNum, int userId, int companyId,string supCode)
        {

            var userAppeals = await _repository.GetUserAppealsBySupervisor(seqNum, userId, companyId,supCode);
            //if (userAppeals.Count()==0)
            //    return BadRequest("Hec bir muraciet yoxdur");
            return Ok(userAppeals);

        }

        [HttpPost("postOrder")]
        public async Task<IActionResult> CreateOrderFlow([FromBody] SaveOrderFlowResource saveOrderResource)
        {
            if (!ModelState.IsValid)
               return BadRequest(ModelState);
            else if (await _repository.CheckOrder(saveOrderResource.MasterId, saveOrderResource.SequenceNumber))
                return BadRequest("Siz emeliyyati artiq yerine yetirmisiniz!");

            var flowMaster = _mapper.Map<SaveOrderFlowResource, OsStFlowmaster>(saveOrderResource);
            flowMaster.CreatedDate = DateTime.Now;
            flowMaster.StatusId = 5;//In Progress
            if (flowMaster.SubCategoryId == 0)
                flowMaster.SubCategoryId = null;

            _repository.AddMaster(flowMaster);
            await _unitOfWork.CompleteAsync();

            var flowLine = _mapper.Map<SaveOrderFlowResource, OsStFlowlines>(saveOrderResource);
            flowLine.MasterId = flowMaster.Id;
            flowLine.ExecutedDate = DateTime.Now;

            _repository.AddLine(flowLine);
            await _unitOfWork.CompleteAsync();


            if (saveOrderResource.SequenceNumber == 1)// ticari marketiqe mail(b.m sifaris kecibse)
                MailService.MailSender(_appSettings.CommercialMarketingMail, "https://onsale.veyseloglu.az:4443/order/" + flowLine.MasterId,flowLine.MasterId.ToString());
            else if (saveOrderResource.SequenceNumber == 2)// marketinqe mail (t.m sifaris kecibse)
                MailService.MailSender(_appSettings.MarketingMail, "https://onsale.veyseloglu.az:4443/order/" + flowLine.MasterId, flowLine.MasterId.ToString());
            

            return Ok(saveOrderResource);

        }

        [HttpPost("updateOrder/{masterId}")]
        public async Task<IActionResult> UpdateOrderFlow(int masterId,[FromBody] SaveOrderFlowResource saveOrderResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            else if (await _repository.CheckOrder(saveOrderResource.MasterId, saveOrderResource.SequenceNumber))
                return BadRequest("Bu əməliyyat artıq icra edilib!");

            var flowLine = _mapper.Map<SaveOrderFlowResource, OsStFlowlines>(saveOrderResource);
            flowLine.MasterId = masterId;
            flowLine.ExecutedDate = DateTime.Now;
            _repository.AddLine(flowLine);
            await _unitOfWork.CompleteAsync();

            var flowMaster = await _repository.GetFlowMasterForOrder(masterId,false);
            flowMaster.SubCategoryId = saveOrderResource.SubCategoryId;

            if (flowLine.SequenceNumber == 4)
            {
                flowMaster.FinalItemCode = saveOrderResource.ItemCode;
                flowMaster.StatusId = 2;//compleated
                flowMaster.CompletedDate= DateTime.Now;

                var items = await _repository.UpdateItemForFlow(saveOrderResource.ItemCode, saveOrderResource.CompanyId);
                items.AssignedTo = saveOrderResource.CustomerCode;
                items.StatusId = 6;//assigned             

            }
            await _unitOfWork.CompleteAsync();

            if (saveOrderResource.SequenceNumber == 2)//t.m tesdiqleyibse
                MailService.MailSender(_appSettings.MarketingMail, "https://onsale.veyseloglu.az:4443/order/" + masterId,masterId.ToString());
            else if (saveOrderResource.SequenceNumber == 3)// m tesdiqleyibse
                MailService.MailSender(_appSettings.OutfitMail, "https://onsale.veyseloglu.az:4443/order/" + flowLine.MasterId, flowLine.MasterId.ToString());

            return Ok(saveOrderResource);
        }

        [HttpPost("cancelOrder/{masterId}")]
        public async Task<IActionResult> CancelOrder(int masterId, [FromBody] SaveOrderFlowResource saveOrderResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            else if (await _repository.CheckOrder(saveOrderResource.MasterId, saveOrderResource.SequenceNumber))
                return BadRequest("Siz artiq emeliyyati yerine yetirmisiniz!");
            var flowLine = _mapper.Map<SaveOrderFlowResource, OsStFlowlines>(saveOrderResource);
            flowLine.MasterId = masterId;
            flowLine.ExecutedDate = DateTime.Now;
            _repository.AddLine(flowLine);
            //await _unitOfWork.CompleteAsync();


            var flowMaster = await _repository.GetFlowMasterForOrder(masterId,false);
            flowMaster.CompletedDate = DateTime.Now;
            flowMaster.StatusId = 3;//canceled

            await _unitOfWork.CompleteAsync();


            return Ok(saveOrderResource);
        }

        [HttpDelete("endAppealProcess/{masterId}")]
        public async Task<IActionResult> EndAppealProcess(int masterId)
        {
            var appeal = await _repository.GetFlowMaster(masterId, true);

            if (appeal == null)
                return NotFound();

            _repository.RemoveMaster(appeal);
            await _unitOfWork.CompleteAsync();

            return Ok(masterId);

        }
        [HttpGet("getPrintResources/{masterId}")]
        public async Task<IActionResult> GetPrintResource(int masterId)
        {
            var prinRes = await _repository.GetPrintResource(masterId);
            if (prinRes == null)
                return NotFound();

            return Ok(prinRes);
        }

    }
}