using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PruebasCatalogoC.Controllers
{
    public class PrincipalController : Controller
    {
        //
        // GET: /Principal/

        public ActionResult List()
        {
            return View();
        }
        public ActionResult PrincipalListForm()
        {
            return View();
        } 

    }
}
