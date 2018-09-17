using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PruebasCatalogoC.Vo;

namespace PruebasCatalogoC.Controllers
{
    public class VistaSistemaController : BaseController
    {
        //
        // GET: /VistaSistema/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult VistaMisCuentas()
        {
            if (SessionObject == null)
            {
                SessionObject = new SessionContextVO();
            }
            SessionObject.VistaActual = VistaSistema.Aplicacion;
            SessionObject.MnSistema = MenuSistema.MisCuentas;
            PutSessionVO();
            return RedirectToAction("List", "Principal");
        }

    }
}
