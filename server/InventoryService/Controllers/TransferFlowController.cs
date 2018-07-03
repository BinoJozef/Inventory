using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using InventoryService.Core;
using InventoryService.Core.Models;
using Microsoft.Extensions.Options;
using InventoryService.Controllers.Resources;
using InventoryService.Helpers;
using Microsoft.AspNetCore.Authorization;

namespace InventoryService.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class TransferFlowController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IFlowRepository _repository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        public TransferFlowController(IMapper mapper, IFlowRepository repository, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _mapper = mapper;
            _repository = repository;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }
        [HttpGet("getTransfer/{masterId}")]
        public async Task<IActionResult> GetTransfer(int masterId)
        {
            var flowMaster = await _repository.GetFlowMasterForTransfer(masterId, true);

            if (flowMaster == null)
                return NotFound();
            else if (flowMaster.StatusId == 3)
                return BadRequest("Əməliyyat imtina edilmişdir!");

            var maxSn = await _repository.GetMaxSn(masterId);

            var transferResource = _mapper.Map<OsStFlowmaster, TransferFlowResource>(flowMaster);
            transferResource.SequenceNumber = maxSn;

            return Ok(transferResource);
        }


        [HttpPost("postTransfer")]
        public async Task<IActionResult> CreateTransferFlow([FromBody] SaveTransferFlowResource saveTransferResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            else if (await _repository.CheckOrder(saveTransferResource.MasterId, saveTransferResource.SequenceNumber))
                return BadRequest("Siz emeliyyati artiq yerine yetirmisiniz!");

            var flowMaster = _mapper.Map<SaveTransferFlowResource, OsStFlowmaster>(saveTransferResource);
            flowMaster.CreatedDate = DateTime.Now;
            flowMaster.StatusId = 5;//In Progress
           
            var item = await _repository.UpdateItemForFlow(saveTransferResource.ItemCode, saveTransferResource.CompanyId);
            if (item == null)
                return BadRequest();
            flowMaster.CategoryId = item.CategoryId;
            flowMaster.SubCategoryId = item.SubCategoryId;

            _repository.AddMaster(flowMaster);
            await _unitOfWork.CompleteAsync();

            var flowLine = _mapper.Map<SaveTransferFlowResource, OsStFlowlines>(saveTransferResource);
            flowLine.MasterId = flowMaster.Id;
            flowLine.ExecutedDate = DateTime.Now;

            _repository.AddLine(flowLine);
            await _unitOfWork.CompleteAsync();


            if (saveTransferResource.FlowTypeId == 2 && saveTransferResource.SequenceNumber==1)// b.m transfer kecenden sonra t.m mail getmesi
                MailService.MailSender(_appSettings.CommercialMarketingMail, "https://onsale.veyseloglu.az:4443/transfer/" + flowLine.MasterId, flowLine.MasterId.ToString());
            else if (saveTransferResource.FlowTypeId == 3 && saveTransferResource.SequenceNumber == 1)//b.m qaytarma kecibse t mail getmesi
                MailService.MailSender(_appSettings.OutfitMail, "https://onsale.veyseloglu.az:4443/transfer/" + flowLine.MasterId, flowLine.MasterId.ToString());

            return Ok(saveTransferResource);

        }

        [HttpPost("updateTransfer/{masterId}")]
        public async Task<IActionResult> UpdateTransferFlow(int masterId, [FromBody] SaveTransferFlowResource saveTransferResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            else if (await _repository.CheckOrder(saveTransferResource.MasterId, saveTransferResource.SequenceNumber))
                return BadRequest("Bu əməliyyat artıq icra edilib!");

            var flowLine = _mapper.Map<SaveTransferFlowResource, OsStFlowlines>(saveTransferResource);
            flowLine.MasterId = masterId;
            flowLine.ExecutedDate = DateTime.Now;
            _repository.AddLine(flowLine);
            await _unitOfWork.CompleteAsync();
 

            if (flowLine.SequenceNumber == 4 )
            {
                var flowMaster = await _repository.GetFlowMasterForTransfer(masterId, false);
                // flowMaster.FinalItemCode = saveOrderResource.ItemCode;
                flowMaster.StatusId = 2;//compleated
                flowMaster.CompletedDate = DateTime.Now;
                var items = await _repository.UpdateItemForFlow(saveTransferResource.ItemCode, saveTransferResource.CompanyId);
                if (saveTransferResource.FlowTypeId == 2)
                { 
                    items.AssignedTo = saveTransferResource.CustomerCode;
                    items.StatusId = 6;//assigned   
                }
                else if(saveTransferResource.FlowTypeId == 3)
                {
                    if (saveTransferResource.ReasonId == 9)//temire gonderilir
                        items.StatusId = 7;//temirde
                    else
                    {
                        items.StatusId = 4;//bos
                        items.AssignedTo = null;
                    }

                }
                await _unitOfWork.CompleteAsync();
            }
           

            if (saveTransferResource.FlowTypeId == 2 && saveTransferResource.SequenceNumber == 2)// mark. transfer 
                MailService.MailSender(_appSettings.MarketingMail, "https://onsale.veyseloglu.az:4443/transfer/" + masterId, masterId.ToString());
           else if (saveTransferResource.SequenceNumber == 3 && saveTransferResource.FlowTypeId == 2)//techizat transfer 
                MailService.MailSender(_appSettings.OutfitMail, "https://onsale.veyseloglu.az:4443/transfer/" + masterId, masterId.ToString());


            return Ok(saveTransferResource);
        }

        [HttpPost("cancelTransfer/{masterId}")]
        public async Task<IActionResult> CancelTransfer(int masterId, [FromBody] SaveTransferFlowResource saveTransferResource)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            else if (await _repository.CheckOrder(saveTransferResource.MasterId, saveTransferResource.SequenceNumber))
                return BadRequest("Siz artiq emeliyyati yerine yetirmisiniz!");
            var flowLine = _mapper.Map<SaveTransferFlowResource, OsStFlowlines>(saveTransferResource);
            flowLine.MasterId = masterId;
            flowLine.ExecutedDate = DateTime.Now;
            _repository.AddLine(flowLine);
            //await _unitOfWork.CompleteAsync();


            var flowMaster = await _repository.GetFlowMasterForTransfer(masterId, false);
            flowMaster.CompletedDate = DateTime.Now;
            flowMaster.StatusId = 3;//canceled

            await _unitOfWork.CompleteAsync();


            return Ok(saveTransferResource);
        }

    }
}