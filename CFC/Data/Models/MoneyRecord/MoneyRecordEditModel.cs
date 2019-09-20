using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models.MoneyRecord
{
    public class MoneyRecordEditModel
    {
        public int RecordId { get; set; }
        public DateTime Created { get; set; }
        public string Description { get; set; }
    }
}
