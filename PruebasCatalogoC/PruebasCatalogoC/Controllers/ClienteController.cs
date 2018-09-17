using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PruebasCatalogoC.Vo;
using PruebasCatalogoC.BS;
using BaseCF.Models.Tools;
using PruebasCatalogoC.Excepciones;

namespace PruebasCatalogoC.Controllers
{
    public class ClienteController : BaseController
    {
        //
        // GET: /Cliente/

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

        public ActionResult GetClienteGrid(BaseGridVO filtro)
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


                ClientesBS BS = new ClientesBS();
                List<ClienteVO> dataSource = BS.GetClienteList(filtro);

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

        public ActionResult GetClienteList(string criterio)
        {
            try
            {
                


                ClientesBS BS = new ClientesBS();
                List<ClienteVO> dataSource = BS.GetClienteList(criterio);

                return Json(dataSource);
            }            
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

        public ActionResult CreateCliente(ClienteVO vo)
        {
            try
            {
                ClientesBS BS = new ClientesBS();
                return Json(BS.CreateCliente(vo));
            }            
            catch (Exception ex)
            {
                return Json(ParseException(new CCExcepcion(ex)));
            }
        }

        public ActionResult UpdateCliente(ClienteVO vo)
        {
            try
            {
                ClientesBS BS = new ClientesBS();
                return Json(BS.UpdateCliente(vo));
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

        public ActionResult GetCliente(int clave)
        {
            try
            {
                ClientesBS BS = new ClientesBS();
                return Json(BS.GetCliente(clave));
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
