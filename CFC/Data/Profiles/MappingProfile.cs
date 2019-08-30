using AutoMapper;
using CFC.Data.Entities;
using CFC.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Add as many of these lines as you need to map your objects
            CreateMap<ApplicationUser, UserExtendedDetailModel>();
            CreateMap<UserExtendedDetailModel, ApplicationUser>();

            CreateMap<CompanyAddModel, Company>();
            CreateMap<Company, CompanyPreviewModel>();
            CreateMap<Company, CompanyViewModel>()
                .ForMember(d => d.BranchesCount, s => s.MapFrom(source => source.Offices.Count))
                .ForMember(d => d.OwnersCount, s => s.MapFrom(source => source.Owners.Count));

            CreateMap<Company, CompanyDetailViewModel>();
            CreateMap<ApplicationUserCompany, CompanyUserViewModel>()
                .ForMember(d => d.UserName, s => s.MapFrom(source => source.User.Name))
                .ForMember(d => d.UserSurname, s => s.MapFrom(source => source.User.Surname));


            CreateMap<CompanyOffice, OfficeCompanyViewModel>()
                .ForMember(d => d.OfficeId, s => s.MapFrom(source => source.Office.Id))
                .ForMember(d => d.OfficeName, s => s.MapFrom(source => source.Office.Name))
                .ForMember(d => d.CompanyId, s => s.MapFrom(source => source.Company.Id))
                .ForMember(d => d.CompanyName, s => s.MapFrom(source => source.Company.Name))
                .ForMember(d => d.CompanyIdentificationNumber, s => s.MapFrom(source => source.Company.IdentificationNumber));
                //.ForMember(d => d.RegistrationDate, s => s.MapFrom(source => source.));



            CreateMap<OfficeAddCompanyModel, CompanyOffice>();
            CreateMap<OfficeAddModel, Office>();
            CreateMap<Office, OfficeDetailViewModel>();
            CreateMap<Office, OfficeViewModel>()
                .ForMember(d => d.CompaniesCount, s => s.MapFrom(source => source.Companies.Count));
        }
    }
}
