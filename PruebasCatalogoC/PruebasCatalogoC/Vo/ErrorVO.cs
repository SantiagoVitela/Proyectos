using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebasCatalogoC.Vo
{
    public class ErrorVO
    {
        public int Clave { get; set; }
        public string MensajeUsuario { get; set; }
        public int ErrorNumber { get; set; }
        public string ErrorDesc { get; set; }
        public string StackTrace { get; set; }
        public List<object> ErrorList { get; set; }
    }
}