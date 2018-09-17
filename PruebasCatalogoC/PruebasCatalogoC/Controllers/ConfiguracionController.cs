using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PruebasCatalogoC.Excepciones;
using PruebasCatalogoC.Vo;
using PruebasCatalogoC.BS;

namespace PruebasCatalogoC.Controllers
{
    public class ConfiguracionController : BaseController
    {
        //
        // GET: /Configuracion/

        public ActionResult Editar(string id)
        {
            ViewBag.Id = id;

            return View();
        }


        public ActionResult CreateConfiguracion(ConfiguracionVO vo)
        {
            try
            {
                ConfiguracionsBS BS = new ConfiguracionsBS();
                return Json(BS.CreateConfiguracion(vo));
            }
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

        public ActionResult UpdateConfiguracion(ConfiguracionVO vo)
        {
            try
            {
                ConfiguracionsBS BS = new ConfiguracionsBS();
                return Json(BS.UpdateConfiguracion(vo));
            }
            catch (CCExcepcion cfex)
            {
                List<object> lista = new List<object>();
                lista.Add(ParseException(cfex));
                return Json(lista);

            }
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

        public ActionResult GetConfiguracion()
        {
            try
            {
                ConfiguracionsBS BS = new ConfiguracionsBS();
                return Json(BS.GetConfiguracion());
            }
            catch (CCExcepcion cfex)
            {
                return Json(ParseException(cfex));
            }
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

    }
}
