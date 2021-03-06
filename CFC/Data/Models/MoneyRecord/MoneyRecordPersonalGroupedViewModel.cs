﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class MoneyRecordPersonalGroupedViewModel
    {
        public MoneyRecordPersonalGroupedViewModel()
        {

        }

        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public List<MoneyRecordViewModel> Records { get; set; }
        public  decimal? Percentage { get; set; }

        public decimal? Cashflow { get; set; }

        public decimal AllDeposit { get; set; }
        public decimal AllWithdraw { get; set; }
        public decimal PersonalDeposit { get; set; }
        public decimal PersonalWithdraw { get; set; }
    }
}
