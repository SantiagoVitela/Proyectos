using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PruebasCatalogoC.Vo;
using PruebasCatalogoC.BS;

namespace PruebasCatalogoC.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";
           
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Página de descripción de la aplicación.";

            return View();
        }

        public ActionResult Clientes(int? id)
        {
            ViewBag.Message = "Clientes.";
            ClientesBS cBS = new ClientesBS();
            //var vo = cBS.ClienteInicial(id);
            return View();
        }



        public ActionResult PrincipalListForm()
        {
            return View();
        } 
    }
}
