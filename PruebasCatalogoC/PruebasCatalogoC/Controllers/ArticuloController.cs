using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PruebasCatalogoC.Vo;
using BaseCF.Models.Tools;
using PruebasCatalogoC.Excepciones;
using PruebasCatalogoC.BS;

namespace PruebasCatalogoC.Controllers
{
    public class ArticuloController : BaseController
    {
        //
        // GET: /Articulo/

        public ActionResult List()
        {
            return View();
        }

        public ActionResult Crear()
        {
            return View();
        }

        public ActionResult Editar(string id)
        {
            ViewBag.Id = id;

            return View();
        }

        public ActionResult Consultar(string id)
        {
            ViewBag.Id = id;

            return View();
        }

        public ActionResult GetArticuloGrid(BaseGridVO filtro)
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


                ArticulosBS BS = new ArticulosBS();
                List<ArticuloVO> dataSource = BS.GetArticuloList(filtro);

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

        public ActionResult CreateArticulo(ArticuloVO vo)
        {
            try
            {
                ArticulosBS BS = new ArticulosBS();
                return Json(BS.CreateArticulo(vo));
            }
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

        public ActionResult UpdateArticulo(ArticuloVO vo)
        {
            try
            {
                ArticulosBS BS = new ArticulosBS();
                return Json(BS.UpdateArticulo(vo));
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

        public ActionResult GetArticulo(int clave)
        {
            try
            {
                ArticulosBS BS = new ArticulosBS();
                return Json(BS.GetArticulo(clave));
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

        public ActionResult GetArticuloParaVenta(int clave)
        {
            try
            {
                ArticulosBS BS = new ArticulosBS();
                return Json(BS.GetArticuloParaVenta(clave));
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

        public ActionResult GetArticuloList(string criterio)
        {
            try
            {



                ArticulosBS BS = new ArticulosBS();
                List<ArticuloVO> dataSource = BS.GetArticuloList(criterio);

                return Json(dataSource);
            }
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

    }
}
