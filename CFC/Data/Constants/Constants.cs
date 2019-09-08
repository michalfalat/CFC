using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Constants
{
    public static class Constants
    {
        public static class Roles
        {
            public const string ADMININISTRATOR = "Administrator";
            public const string OWNER = "Owner";
            public const string ADMININISTRATOR_AND_OWNER = "Administrator,Owner";
        }

        public static class RecordType
        {
            public const string COMPANY = "company";
            public const string PERSONAL = "personal";
            public const string ALL = "all";
        }
    }
}
