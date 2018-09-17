using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PruebasCatalogoC.Conexion;
using PruebasCatalogoC.Vo;
using PruebasCatalogoC.Excepciones;

namespace PruebasCatalogoC.BS
{
    public class ConfiguracionsBS
    {
        
        MySqlClass Con;
        public ConfiguracionsBS()
        { 
            Con = new MySqlClass();
        }


        public int CreateConfiguracion(ConfiguracionVO vo)
        {
            try
            {
                return this.Con.CreateConfiguracion(vo);
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

        public int UpdateConfiguracion(ConfiguracionVO vo)
        {
            try
            {

                return  this.Con.UpdateConfiguracion(vo);
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

        public ConfiguracionVO GetConfiguracion()
        {
            try
            {
                //seguridadBS.ValidaPrivilegio(IPermisos.ConfiguracionConsulta, IPermisos.ConfiguracionConsulta);
                return this.Con.ConfiguracionObtenerPorClave();
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