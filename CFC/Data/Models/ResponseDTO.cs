using CFC.Data.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CFC.Data.Models
{
    public class ResponseDTO
    {
        public ResponseDTO()
        {
            this.Status = ResponseDTOStatus.OK;
            this.Message = "";
            this.Data = null;
            this.ErrorLabel = ResponseDTOErrorLabel.NONE;
            this.Error = "";
        }
        public ResponseDTO(ResponseDTOStatus status)
        {
            this.Status = status;
            this.Message = "";
            this.Data = null;
            this.ErrorLabel = ResponseDTOErrorLabel.NONE;
            this.Error = "";
        }
        public ResponseDTO(ResponseDTOStatus status, object data)
        {
            this.Status = status;
            this.Message = "";
            this.Data = data;
            this.ErrorLabel = ResponseDTOErrorLabel.NONE;
            this.Error = "";
        }
        public ResponseDTO(ResponseDTOStatus status, ResponseDTOErrorLabel errorLabel, string error)
        {
            this.Status = status;
            this.Message = "";
            this.Data = null;
            this.ErrorLabel = errorLabel;
            this.Error = error;
        }

        public ResponseDTO(ResponseDTOStatus status, ResponseDTOErrorLabel errorLabel)
        {
            this.Status = status;
            this.Message = "";
            this.Data = null;
            this.ErrorLabel = errorLabel;
            this.Error = "";
        }

        public ResponseDTO(ResponseDTOStatus status, ResponseDTOErrorLabel errorLabel, string message = "", object data = null, string error = "")
        {
            this.Status = status;
            this.Message = message;
            this.Data = data;
            this.ErrorLabel = errorLabel;
            this.Error = error;
        }

        public ResponseDTOStatus Status { get; set; }
        public string Message { get; set; }

        public object Data { get; set; }
        public ResponseDTOErrorLabel ErrorLabel { get; set; }

        public string Error { get; set; }
    }
}
