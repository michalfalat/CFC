using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class CompanyDetailViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IdentificationNumber { get; set; }
        public DateTimeOffset RegistrationDate { get; set; }

        public CompanyStatus Status { get; set; }

        public bool Obsolete { get; set; }

        //TODO
        //public int BranchesCount { get; set; }
        //public int OwnersCount { get; set; }ublic bool Obsolete { get; set; }
        public ICollection<CompanyUserViewModel> Owners { get; set; }

    }
}
