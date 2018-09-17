using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PruebasCatalogoC.Conexion;
using PruebasCatalogoC.Vo;
using PruebasCatalogoC.Excepciones;

namespace PruebasCatalogoC.BS
{
    public class ClientesBS
    {
        MySqlClass Con;
        public ClientesBS()
        { 
            Con = new MySqlClass();
        }

        public List<ClienteVO> GetClienteList(BaseGridVO filtro)
        {
            try
            {                
                return this.Con.GetClienteList(filtro);
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

        public List<ClienteVO> GetClienteList(string criterio)
        {
            var ll = GetClienteList(new BaseGridVO { pagina = 0, porpagina = 1000000 });
            var listaR = ll;
            if (ll != null && ll.Count() > 0)
            {
                listaR = ll.Where(m => m.NombreCompleto.ToLower().Contains(criterio.ToLower())).ToList();
            }
            else
            {
                listaR = new List<ClienteVO>();
            }
            foreach (var l in listaR)
            {
                l.value = l.Clave.ToString();
                l.text = l.NombreCompleto;
            }
            return listaR;
        }

        public int CreateCliente(ClienteVO vo)
        {
            try
            {
                return this.Con.CreateCliente(vo);
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

        public int UpdateCliente(ClienteVO vo)
        {
            try
            {

                return  this.Con.UpdateCliente(vo);
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

        public ClienteVO GetCliente(int clave)
        {
            try
            {
                //seguridadBS.ValidaPrivilegio(IPermisos.ClienteConsulta, IPermisos.ClienteConsulta);
                return this.Con.ClienteObtenerPorClave(clave);
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