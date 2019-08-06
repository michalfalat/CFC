using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class OfficeDetailViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTimeOffset RegistrationDate { get; set; }
        public OfficeStatus Status { get; set; }
        public bool Obsolete { get; set; }
        public CompanyDetailViewModel Company { get; set; }
        public ICollection<OfficeUserViewModel> Owners { get; set; }
    }
}
