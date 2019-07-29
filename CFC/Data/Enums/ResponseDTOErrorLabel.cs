using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Enums
{
    public class ResponseDTOErrorLabel
    {
        private ResponseDTOErrorLabel(string value) { Value = value; }

        public string Value { get; set; }
        public static ResponseDTOErrorLabel NONE { get { return new ResponseDTOErrorLabel("NONE"); } }
        public static ResponseDTOErrorLabel MODEL_STATE_ERROR { get { return new ResponseDTOErrorLabel("MODEL_STATE_ERROR"); } }
        public static ResponseDTOErrorLabel USER_NOT_FOUND { get { return new ResponseDTOErrorLabel("USER_NOT_FOUND"); } }
        public static ResponseDTOErrorLabel FORBIDDEN { get { return new ResponseDTOErrorLabel("FORBIDDEN"); } }
        public static ResponseDTOErrorLabel INVALID_PASSWORD { get { return new ResponseDTOErrorLabel("INVALID_PASSWORD"); } }
        public static ResponseDTOErrorLabel INVALID_TOKEN { get { return new ResponseDTOErrorLabel("INVALID_TOKEN"); } }
        public static ResponseDTOErrorLabel NOT_FOUND { get { return new ResponseDTOErrorLabel("NOT_FOUND"); } }
        public static ResponseDTOErrorLabel BLOCKED { get { return new ResponseDTOErrorLabel("BLOCKED"); } }
        public static ResponseDTOErrorLabel OBSOLETE { get { return new ResponseDTOErrorLabel("OBSOLETE"); } }
        public static ResponseDTOErrorLabel DOUBLE_FA { get { return new ResponseDTOErrorLabel("DOUBLE_FA"); } }
        public static ResponseDTOErrorLabel EXISTING_USER { get { return new ResponseDTOErrorLabel("EXISTING_USER"); } }
        public static ResponseDTOErrorLabel NOT_SUCEEDED { get { return new ResponseDTOErrorLabel("NOT_SUCEEDED"); } }
    }
}
