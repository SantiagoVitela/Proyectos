using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PruebasCatalogoC.Excepciones;
using PruebasCatalogoC.Conexion;
using PruebasCatalogoC.Vo;

namespace PruebasCatalogoC.BS
{
    public class VentasBS
    {
        
        MySqlClass Con;
        public VentasBS()
        { 
            Con = new MySqlClass();
        }

        public List<VentaVO> GetVentaList(BaseGridVO filtro)
        {
            try
            {                
                return this.Con.GetVentaList(filtro);
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

        public List<VentaVO> GetVentaList()
        {
            return GetVentaList(new BaseGridVO { pagina = 0, porpagina = 1000000 });
        }

        public int CreateVenta(VentaVO vo)
        {
            try
            {
                return this.Con.CreateVenta(vo);
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

        public string GetFolioVenta()
        {
            var f = this.Con.GetFolioVenta();
            f = f == "" ? "0" : f;
            return ((int.Parse(f??"0")+1).ToString()).PadLeft(6,'0');
        }
        
    }
}