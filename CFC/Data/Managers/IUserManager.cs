﻿using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Managers
{
    public interface IApplicationUserManager
    {
        void Create(ApplicationUser entity);
        Task<ApplicationUser> FindById(string id);
    }
}
