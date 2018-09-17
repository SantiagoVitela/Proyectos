using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BaseCF.Models.Tools;
using PruebasCatalogoC.Excepciones;
using PruebasCatalogoC.Vo;
using PruebasCatalogoC.BS;

namespace PruebasCatalogoC.Controllers
{
    public class VentaController : BaseController
    {
        //
        // GET: /Venta/

        public ActionResult List()
        {
            return View();
        }

        public ActionResult Crear()
        {
            VentasBS BS = new VentasBS();
            var Folio = BS.GetFolioVenta();
            ViewBag.Folio = Folio;
            return View();
        }

        public ActionResult VentaForm()
        {
            VentasBS BS = new VentasBS();
            var Folio = BS.GetFolioVenta();
            ViewBag.Folio = Folio;
            return View();
        }

        public ActionResult GetVentaGrid(BaseGridVO filtro)
        {
            try
            {
                if (filtro.orderby == null || filtro.orderby == string.Empty)
                {
                    filtro.orderby = "clave";
                }

                if (filtro.ordertype == null || filtro.ordertype == string.Empty)
                {
                    filtro.ordertype = "asc";
                }

                filtro.porpagina = 10;
                filtro.realPath = Server.MapPath("~/XmlGrids/" + filtro.xmlgrid + ".xml");


                VentasBS BS = new VentasBS();
                List<VentaVO> dataSource = BS.GetVentaList(filtro);

                int total = 0;
                if (dataSource.Count > 0)
                {
                    total = dataSource[0].total;
                }

                List<object> listaGrid = dataSource.ToList<object>();
                listaGrid.Add(total);

                LazyLoadDatagrid lazyGrid = new LazyLoadDatagrid();
                lazyGrid.regresaLazyLoadDatagrid(filtro.realPath, filtro.objJavascript, listaGrid);

                return Content(lazyGrid.stbHtml.ToString());
            }
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

        public ActionResult CreateVenta(VentaVO vo)
        {
            try
            {
                VentasBS BS = new VentasBS();
                return Json(BS.CreateVenta(vo));
            }
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

    }
}
