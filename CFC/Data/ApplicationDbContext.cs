using System;
using System.Collections.Generic;
using System.Text;
using CFC.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CFC.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<ApplicationUserCompany> ApplicatiionUserCompanies { get; set; }
        public virtual DbSet<Office> Offices { get; set; }
        public virtual DbSet<CompanyOffice> CompanyOffices { get; set; }

    }
}
