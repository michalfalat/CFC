using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class ApplicationUser : IdentityUser 
    {
        public ApplicationUser()
        {

        }

        public string Name { get; set; }
        public string Surname { get; set; }
        public bool Blocked { get; set; }
        public bool Obsolete { get; set; }

        public ICollection<ApplicationUserCompany> Companies { get; set; }
        public ICollection<ApplicationUserOffice> Offices { get; set; }


    }
}
