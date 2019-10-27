﻿using CFC.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Repositories
{
    public class PasswordResetTokenRepository : Repository<PasswordResetToken>, IPasswordResetTokenRepository
    {
        public PasswordResetTokenRepository(ApplicationDbContext repositoryContext)
            : base(repositoryContext)
        {
        }
    }
}
