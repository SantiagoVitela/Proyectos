using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PruebasCatalogoC.Vo;
using System.Web.Script.Serialization;
using PruebasCatalogoC.Excepciones;

namespace PruebasCatalogoC.Controllers
{
    public class BaseController : Controller
    {
        //
        // GET: /Base/

        protected SessionContextVO SessionObject = null;
        protected string stringNameSession = "sessionContext";

        public ActionResult Index()
        {
            return View();
        }

        protected void PutSessionVO()
        {
            Session[stringNameSession] = SessionObject;
        }


        protected ErrorVO ParseException(CCExcepcion ex, bool log)
        {
            

            ErrorVO er = new ErrorVO();
            er.Clave = ex.Clave;
            er.MensajeUsuario = ex.MensajeUsuario;
            er.ErrorNumber = (int)ex.Resultado;
            er.ErrorDesc = ex.MensajeUsuario;
            er.StackTrace = ex.StackTrace;

            if (ex.ErrorForm != null)
            {
                er.ErrorList = ex.ErrorForm.ToList<object>();
            }

            return er;
        }

        protected ErrorVO ParseException(CCExcepcion ex)
        {
            return ParseException(ex, true);
        }

        protected string ParseExceptionAsJsonString(CCExcepcion ex)
        {
            return ParseExceptionAsJsonString(ex, true);
        }

        protected string ParseExceptionAsJsonString(CCExcepcion ex, bool log)
        {
            

            ErrorVO er = new ErrorVO();
            er.ErrorNumber = (int)ex.Resultado;
            er.ErrorDesc = ex.MensajeUsuario;
            er.StackTrace = ex.StackTrace;
            er.ErrorList = ex.ErrorForm.ToList<object>();

            JavaScriptSerializer js = new JavaScriptSerializer();
            string json = js.Serialize(er);

            return json;
        }

    }
}
