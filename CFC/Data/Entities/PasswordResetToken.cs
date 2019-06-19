using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Entities
{
    public class PasswordResetToken : IEntity
    {
        public PasswordResetToken()
        {
            this.IsUsed = false;
            this.Link = Guid.NewGuid();

        }
        public int Id { get; set; }
        public string Token { get; set; }
        public Guid Link { get; set; }
        public DateTimeOffset ValidTo { get; set; }
        public bool IsUsed { get; set; }
        public string UserEmail { get; set; }

    }
}
