﻿using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class MoneyRecordEditModel
    {
        public int RecordId { get; set; }
        public int? CompanyId { get; set; }

        public int? OfficeId { get; set; }

        [Required]
        public MoneyRecordType Type { get; set; }

        [Required]
        public decimal Amount { get; set; }
        public DateTime Created { get; set; }

        [Required]
        [MinLength(3)]
        public string Description { get; set; }

    }
}
