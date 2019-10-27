using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class VerifyUserToken
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public bool Obsolete { get; set; }
        public string Token { get; set; }
    }
}
