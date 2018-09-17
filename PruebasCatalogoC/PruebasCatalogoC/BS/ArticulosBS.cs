using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PruebasCatalogoC.Conexion;
using PruebasCatalogoC.Vo;
using PruebasCatalogoC.Excepciones;

namespace PruebasCatalogoC.BS
{
    public class ArticulosBS
    {
        
        MySqlClass Con;
        public ArticulosBS()
        { 
            Con = new MySqlClass();
        }

        public List<ArticuloVO> GetArticuloList(BaseGridVO filtro)
        {
            try
            {                
                return this.Con.GetArticuloList(filtro);
            }
            catch (CCExcepcion)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new CCExcepcion(ex);
            }
        }

        public List<ArticuloVO> GetArticuloList(string criterio)
        {
            var ll = GetArticuloList(new BaseGridVO { pagina = 0, porpagina = 1000000 });
            var listaR = ll;
            if (ll != null && ll.Count() > 0)
            {
                listaR = ll.Where(m => m.Descripcion.ToLower().Contains(criterio.ToLower())).ToList();
            }
            else
            {
                listaR = new List<ArticuloVO>();
            }
            foreach (var l in listaR)
            {
                l.value = l.Clave.ToString();
                l.text = l.Descripcion;
            }
            return listaR;
        }

        public int CreateArticulo(ArticuloVO vo)
        {
            try
            {
                return this.Con.CreateArticulo(vo);
            }
            catch (CCExcepcion)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new CCExcepcion(ex);
            }
        }

        public int UpdateArticulo(ArticuloVO vo)
        {
            try
            {

                return  this.Con.UpdateArticulo(vo);
            }
            catch (CCExcepcion)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new CCExcepcion(ex);
            }
        }

        public ArticuloVO GetArticulo(int clave)
        {
            try
            {
                //seguridadBS.ValidaPrivilegio(IPermisos.ArticuloConsulta, IPermisos.ArticuloConsulta);
                return this.Con.ArticuloObtenerPorClave(clave);
            }
            catch (CCExcepcion)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new CCExcepcion(ex);
            }
        }

        public ArticuloVentaVO GetArticuloParaVenta(int clave)
        {
            try
            {
                //seguridadBS.ValidaPrivilegio(IPermisos.ArticuloConsulta, IPermisos.ArticuloConsulta);
                var articulo = this.Con.ArticuloObtenerPorClave(clave);
                var ArtRet = new ArticuloVentaVO();
                if (articulo != null)
                {
                    if (articulo.Existencia <= 0)
                    {
                        throw new CCExcepcion(5, "Error", "El artículo seleccionado no cuenta con existencia, favor de verificar");
                    }
                    ArtRet = new ArticuloVentaVO(articulo);
                    var con = this.Con.ConfiguracionObtenerPorClave();
                    ArtRet.PrecioReal = ArtRet.Precio * (1 + (con.Tasa * con.PlazoMaximo) / 100);
                    ArtRet.Importe = ArtRet.Cantidad * ArtRet.PrecioReal;
                }


                return ArtRet;

            }
            catch (CCExcepcion)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new CCExcepcion(ex);
            }
        }
    }
}