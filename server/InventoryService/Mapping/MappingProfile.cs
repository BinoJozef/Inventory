using AutoMapper;
using InventoryService.Controllers.Resources;
using InventoryService.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryService.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            //domain to api
            CreateMap<OsStCustomers, CustomerResource>();
            CreateMap<OsStItemcategories, CategoryResource>()
                .ForMember(cr=>cr.SubCategories,opt=>opt.MapFrom(c=>c.OsStItemsubcategories));
            CreateMap<OsStItemcategories, KeyValuePairResource>();
            CreateMap<OsStItemsubcategories, KeyValuePairResource>();
            CreateMap<OsStItems, ItemResource>();
            CreateMap<OsStFlowmaster, OrderFlowResource>()
                .ForMember(or => or.MasterId, opt => opt.MapFrom(fm => fm.Id))
                .ForMember(or => or.Notes, opt => opt.MapFrom(fm => fm.OsStFlowlines.Select(fl => new NotesResource { ProfessionId=fl.SequenceNumber, Note=fl.Note, UserId=fl.ExecutedBy })));

            CreateMap<OsStFlowmaster, TransferFlowResource>()
               .ForMember(or => or.MasterId, opt => opt.MapFrom(fm => fm.Id))
               .ForMember(or=>or.ItemCode,opt=>opt.MapFrom(fm=>fm.FinalItemCode))
               .ForMember(or => or.Notes, opt => opt.MapFrom(fm => fm.OsStFlowlines.Select(fl => new NotesResource { ProfessionId = fl.SequenceNumber, Note = fl.Note, UserId = fl.ExecutedBy })));

            CreateMap<OsStItems, AllItemsResource>()
                .ForMember(ir => ir.Company, opt => opt.MapFrom(i => i.Company.Companyname))
                .ForMember(ir => ir.Category, opt => opt.MapFrom(i => i.Category.Name))
                .ForMember(ir => ir.SubCategory, opt => opt.MapFrom(i => i.SubCategory.Name))
                .ForMember(ir => ir.Status, opt => opt.MapFrom(i => i.Status.StatusName));

            CreateMap<OsStStatus, KeyValuePairResource>().
                ForMember(vp => vp.Name, opt => opt.MapFrom(s => s.StatusName));
            CreateMap<OsStFlowlines, FlowLineResource>();


            //api to domain
            CreateMap<CategoryResource, OsStItemcategories>()
                 .ForMember(ic => ic.Id, opt => opt.Ignore());
            CreateMap<SaveOrderFlowResource, OsStFlowmaster>()
                .ForMember(fm => fm.Id, opt => opt.Ignore())
                .ForMember(fm => fm.StatusId, opt => opt.Ignore())
                .ForMember(fm => fm.FinalItemCode, opt => opt.MapFrom(or => or.ItemCode))
                .ForMember(fm => fm.CreatedBy, opt => opt.MapFrom(or => or.UserId));
            CreateMap<SaveOrderFlowResource, OsStFlowlines>()
                .ForMember(fl => fl.Id, opt => opt.Ignore())
                .ForMember(fl => fl.MasterId, opt => opt.Ignore())
                .ForMember(fl => fl.ExecutedBy, opt => opt.MapFrom(or => or.UserId));

            CreateMap<SaveTransferFlowResource, OsStFlowmaster>()
                .ForMember(fm => fm.Id, opt => opt.Ignore())
                .ForMember(fm => fm.StatusId, opt => opt.Ignore())
                .ForMember(fm => fm.FinalItemCode, opt => opt.MapFrom(or => or.ItemCode))
                .ForMember(fm => fm.CreatedBy, opt => opt.MapFrom(or => or.UserId));
            CreateMap<SaveTransferFlowResource, OsStFlowlines>()
                .ForMember(fl => fl.Id, opt => opt.Ignore())
                .ForMember(fl => fl.MasterId, opt => opt.Ignore())
                .ForMember(fl => fl.ExecutedBy, opt => opt.MapFrom(or => or.UserId));



        }
    }
}
