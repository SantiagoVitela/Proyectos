using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;
using System.Data;
using PruebasCatalogoC.Vo;

namespace PruebasCatalogoC.Conexion
{
    public class MySqlClass
    {
        public MySqlConnection Conexion;

        public bool exito;

        public MySqlClass()
        {
            Conexion = ConectionClass.connection();
            try
            {
                Conexion.Open();
                exito = true;
            }
            catch (Exception e)
            {
                throw e;// ("error al conectar a base de datos\n" + e.Message);
            }

        }

        public void CloseConection()
        {
            if (this.Conexion.State == System.Data.ConnectionState.Open)
            {
                this.Conexion.Close();
            }
        }


        #region Clientes

        public int CreateCliente(ClienteVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Cliente_crear";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_nombre", vo.Nombre);
                comando.Parameters.AddWithValue("p_apaterno", vo.ApellidoPaterno);
                comando.Parameters.AddWithValue("p_amaterno", vo.ApellidoMaterno);
                comando.Parameters.AddWithValue("p_rfc", vo.RFC);
                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return int.Parse(resp);
        }

        public int UpdateCliente(ClienteVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Cliente_actualizar";
                MySqlCommand comando = this.Conexion.CreateCommand();

                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_nombre", vo.Nombre);
                comando.Parameters.AddWithValue("p_apaterno", vo.ApellidoPaterno);
                comando.Parameters.AddWithValue("p_amaterno", vo.ApellidoMaterno);
                comando.Parameters.AddWithValue("p_rfc", vo.RFC);
                comando.Parameters.AddWithValue("p_clave", vo.Clave);

                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return int.Parse(resp);
        }

        public string ClienteEliminar(ClienteVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_contaCliente_eliminar";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_id", vo.Clave);

                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return resp;
        }

        public ClienteVO ClienteObtenerPorClave(int claveCliente)
        {
            MySqlDataReader dr = null;
            ClienteVO vo = null;
            try
            {
                string query = "sp_Cliente_selectporclave";
                MySqlCommand comando = this.Conexion.CreateCommand();

                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_clave", claveCliente);

                // Se toma el valor devuelto
                dr = comando.ExecuteReader();

                if (dr.HasRows)
                {
                    dr.Read();
                    vo = new ClienteVO();
                    vo.Clave = dr.GetInt32(dr.GetOrdinal("Clave"));
                    vo.Nombre = dr["Nombre"].ToString();
                    vo.ApellidoPaterno = dr["ApPaterno"].ToString();
                    vo.ApellidoMaterno = dr["ApMaterno"].ToString();
                    vo.RFC = dr["RFC"].ToString();
                }
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (dr != null && !dr.IsClosed)
                    dr.Close();

                dr = null;
            }

            return vo;
        }


        public List<ClienteVO> GetClienteList(BaseGridVO filtro)
        {
            List<ClienteVO> lista = new List<ClienteVO>();
            MySqlDataReader dr = null;
            try
            {
                string query = "sp_clientes_select_lista";
                MySqlCommand comando = this.Conexion.CreateCommand();                
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.Add("p_campobusqueda", MySqlDbType.VarChar).Value = filtro.campobusqueda ?? string.Empty;
                comando.Parameters.Add("p_valorbusqueda", MySqlDbType.VarChar).Value = filtro.valorbusqueda ?? string.Empty;
                comando.Parameters.Add("p_numeropagina", MySqlDbType.Int32).Value = filtro.pagina;
                comando.Parameters.Add("p_porpagina", MySqlDbType.Int32).Value = filtro.porpagina;
                comando.Parameters.Add("p_orderby", MySqlDbType.VarChar).Value = filtro.orderby;
                comando.Parameters.Add("p_ordertype", MySqlDbType.VarChar).Value = filtro.ordertype;
                // Se toma el valor devuelto
                dr = comando.ExecuteReader();

                if (dr.HasRows)
                {
                    ClienteVO vo;
                    while (dr.Read())
                    {
                        vo = new ClienteVO();

                        vo.Clave = dr.GetInt32(dr.GetOrdinal("Clave"));
                        
                        vo.Nombre = dr["Nombre"].ToString();
                        vo.ApellidoPaterno = dr["ApPaterno"].ToString();
                        vo.ApellidoMaterno = dr["ApMaterno"].ToString();
                        vo.RFC = dr["RFC"].ToString();
                        vo.total = Convert.ToInt32(dr["total"]);
                        lista.Add(vo);

                    }
                }



            }            
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (dr != null && !dr.IsClosed)
                    dr.Close();

                dr = null;
            }

            return lista;
        }
        #endregion

        #region Articulos

        public int CreateArticulo(ArticuloVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Articulo_crear";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_descripcion", vo.Descripcion);
                comando.Parameters.AddWithValue("p_modelo", vo.Modelo);
                comando.Parameters.AddWithValue("p_precio", vo.Precio);
                comando.Parameters.AddWithValue("p_existencia", vo.Existencia);
                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return int.Parse(resp);
        }

        public int UpdateArticulo(ArticuloVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Articulo_actualizar";
                MySqlCommand comando = this.Conexion.CreateCommand();

                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_descripcion", vo.Descripcion);
                comando.Parameters.AddWithValue("p_modelo", vo.Modelo);
                comando.Parameters.AddWithValue("p_precio", vo.Precio);
                comando.Parameters.AddWithValue("p_existencia", vo.Existencia);
                comando.Parameters.AddWithValue("p_clave", vo.Clave);

                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return int.Parse(resp);
        }

        public string ArticuloEliminar(ArticuloVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_contaArticulo_eliminar";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_id", vo.Clave);

                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return resp;
        }

        public ArticuloVO ArticuloObtenerPorClave(int claveArticulo)
        {
            MySqlDataReader dr = null;
            ArticuloVO vo = null;
            try
            {
                string query = "sp_Articulo_selectporclave";
                MySqlCommand comando = this.Conexion.CreateCommand();

                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_clave", claveArticulo);

                // Se toma el valor devuelto
                dr = comando.ExecuteReader();

                if (dr.HasRows)
                {
                    dr.Read();
                    vo = new ArticuloVO();
                    vo.Clave = dr.GetInt32(dr.GetOrdinal("Clave"));
                    vo.Descripcion = dr["Descripcion"].ToString();
                    vo.Modelo = dr["Modelo"].ToString();
                    vo.Precio = dr.GetDecimal(dr.GetOrdinal("Precio"));
                    vo.Existencia = dr.GetInt32(dr.GetOrdinal("Existencia"));
                }
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (dr != null && !dr.IsClosed)
                    dr.Close();

                dr = null;
            }

            return vo;
        }


        public List<ArticuloVO> GetArticuloList(BaseGridVO filtro)
        {
            List<ArticuloVO> lista = new List<ArticuloVO>();
            MySqlDataReader dr = null;
            try
            {
                string query = "sp_Articulos_select_lista";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.Add("p_campobusqueda", MySqlDbType.VarChar).Value = filtro.campobusqueda ?? string.Empty;
                comando.Parameters.Add("p_valorbusqueda", MySqlDbType.VarChar).Value = filtro.valorbusqueda ?? string.Empty;
                comando.Parameters.Add("p_numeropagina", MySqlDbType.Int32).Value = filtro.pagina;
                comando.Parameters.Add("p_porpagina", MySqlDbType.Int32).Value = filtro.porpagina;
                comando.Parameters.Add("p_orderby", MySqlDbType.VarChar).Value = filtro.orderby;
                comando.Parameters.Add("p_ordertype", MySqlDbType.VarChar).Value = filtro.ordertype;
                // Se toma el valor devuelto
                dr = comando.ExecuteReader();

                if (dr.HasRows)
                {
                    ArticuloVO vo;
                    while (dr.Read())
                    {
                        vo = new ArticuloVO();

                        vo.Clave = dr.GetInt32(dr.GetOrdinal("Clave"));

                        vo.Descripcion = dr["Descripcion"].ToString();
                        vo.Modelo = dr["Modelo"].ToString();
                        vo.Precio = dr.GetDecimal(dr.GetOrdinal("Precio"));
                        vo.Existencia = dr.GetInt32(dr.GetOrdinal("Existencia"));
                        vo.total = Convert.ToInt32(dr["total"]);
                        lista.Add(vo);

                    }
                }



            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (dr != null && !dr.IsClosed)
                    dr.Close();

                dr = null;
            }

            return lista;
        }
        #endregion

        #region ventas

        public List<VentaVO> GetVentaList(BaseGridVO filtro)
        {
            List<VentaVO> lista = new List<VentaVO>();
            MySqlDataReader dr = null;
            try
            {
                string query = "sp_Ventas_select_lista";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.Add("p_campobusqueda", MySqlDbType.VarChar).Value = filtro.campobusqueda ?? string.Empty;
                comando.Parameters.Add("p_valorbusqueda", MySqlDbType.VarChar).Value = filtro.valorbusqueda ?? string.Empty;
                comando.Parameters.Add("p_numeropagina", MySqlDbType.Int32).Value = filtro.pagina;
                comando.Parameters.Add("p_porpagina", MySqlDbType.Int32).Value = filtro.porpagina;
                comando.Parameters.Add("p_orderby", MySqlDbType.VarChar).Value = filtro.orderby;
                comando.Parameters.Add("p_ordertype", MySqlDbType.VarChar).Value = filtro.ordertype;
                // Se toma el valor devuelto
                dr = comando.ExecuteReader();

                if (dr.HasRows)
                {
                    VentaVO vo;
                    while (dr.Read())
                    {
                        vo = new VentaVO();

                        vo.Clave = dr.GetInt32(dr.GetOrdinal("Clave"));

                        vo.Cliente = dr.GetInt32(dr.GetOrdinal("Cliente"));
                        vo.ClienteNombre = dr["ClienteNombre"].ToString();
                        vo.Folio = dr["Folio"].ToString();
                        vo.TotalT = dr.GetDecimal(dr.GetOrdinal("TotalT"));
                        var Fecha = Convert.ToDateTime(dr["Fecha"]);
                        vo.Fecha = Fecha.ToString("yyyy-MM-dd");
                        //vo.RFC = dr["RFC"].ToString();
                        vo.total = Convert.ToInt32(dr["total"]);
                        lista.Add(vo);

                    }
                }



            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (dr != null && !dr.IsClosed)
                    dr.Close();

                dr = null;
            }

            return lista;
        }
        
        public int CreateVenta(VentaVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Venta_crear";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_cliente", vo.Cliente);
                comando.Parameters.AddWithValue("p_Folio", vo.Folio);
                comando.Parameters.AddWithValue("p_enganche", vo.Enganche);
                comando.Parameters.AddWithValue("p_bonificacion", vo.Bonificacion);
                comando.Parameters.AddWithValue("p_totalt", vo.TotalT);
                comando.Parameters.AddWithValue("p_plazo", vo.Plazo);
                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return int.Parse(resp);
        }

        public string GetFolioVenta()
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Venta_obtienefolio";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                //comando.Parameters.AddWithValue("p_nombre", vo.Nombre);
                //comando.Parameters.AddWithValue("p_apaterno", vo.ApellidoPaterno);
                //comando.Parameters.AddWithValue("p_amaterno", vo.ApellidoMaterno);
                //comando.Parameters.AddWithValue("p_rfc", vo.RFC);
                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return (resp);
        }

        #endregion

        #region Configuracions

        public int CreateConfiguracion(ConfiguracionVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Configuracion_crear";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_tasa", vo.Tasa);
                comando.Parameters.AddWithValue("p_porcenganche", vo.PorcEnganche);
                comando.Parameters.AddWithValue("p_plazomaximo", vo.PlazoMaximo);
                
                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return int.Parse(resp);
        }

        public int UpdateConfiguracion(ConfiguracionVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_Configuracion_actualizar";
                MySqlCommand comando = this.Conexion.CreateCommand();

                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_tasa", vo.Tasa);
                comando.Parameters.AddWithValue("p_porcenganche", vo.PorcEnganche);
                comando.Parameters.AddWithValue("p_plazomaximo", vo.PlazoMaximo);
                comando.Parameters.AddWithValue("p_clave", vo.Clave);

                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return int.Parse(resp);
        }

        public string ConfiguracionEliminar(ConfiguracionVO vo)
        {
            string resp = string.Empty;
            try
            {
                string query = "sp_contaConfiguracion_eliminar";
                MySqlCommand comando = this.Conexion.CreateCommand();
                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;
                comando.Parameters.AddWithValue("p_id", vo.Clave);

                // Se toma el valor devuelto
                resp = comando.ExecuteScalar().ToString();

            }
            catch (Exception Ex)
            {
                throw Ex;
            }

            return resp;
        }

        public ConfiguracionVO ConfiguracionObtenerPorClave( )
        {
            MySqlDataReader dr = null;
            ConfiguracionVO vo = new ConfiguracionVO();
            try
            {
                string query = "sp_Configuracion_select";
                MySqlCommand comando = this.Conexion.CreateCommand();

                comando.CommandType = CommandType.StoredProcedure;
                comando.CommandText = query;

                // Se toma el valor devuelto
                dr = comando.ExecuteReader();

                if (dr.HasRows)
                {
                    dr.Read();
                    vo = new ConfiguracionVO();
                    vo.Clave = dr.GetInt32(dr.GetOrdinal("Clave"));
                    vo.Tasa = dr.GetDecimal(dr.GetOrdinal("Tasa"));
                    vo.PorcEnganche = dr.GetDecimal(dr.GetOrdinal("PorcEnganche"));
                    vo.PlazoMaximo = dr.GetInt32(dr.GetOrdinal("PlazoMaximo"));
                }
            }
            catch (Exception Ex)
            {
                throw Ex;
            }
            finally
            {
                if (dr != null && !dr.IsClosed)
                    dr.Close();

                dr = null;
            }

            return vo;
        }
        #endregion

        //#region Estudios

       // public string EstudioCrear(EstudioVO vo)
       // {
       //     string resp = string.Empty;
       //     try
       //     {
       //         string query = "sp_estudio_crear";
       //         MySqlCommand comando = this.Conexion.CreateCommand();                
       //         comando.CommandType = CommandType.StoredProcedure;
       //         comando.CommandText = query;
       //         comando.Parameters.AddWithValue("p_nombre", vo.Nombre);
       //         comando.Parameters.AddWithValue("p_precio", vo.Precio);
       //         // Se toma el valor devuelto
       //         resp = comando.ExecuteScalar().ToString();

       //     }            
       //     catch (Exception Ex)
       //     {
       //         throw Ex;
       //     }

       //     return resp;
       // }

       // public string EstudioActualizar(EstudioVO vo)
       // {
       //     string resp = string.Empty;
       //     try
       //     {
       //         string query = "sp_estudio_actualizar";
       //         MySqlCommand comando = this.Conexion.CreateCommand();
                
       //         comando.CommandType = CommandType.StoredProcedure;
       //         comando.CommandText = query;
       //         comando.Parameters.AddWithValue("p_nombre", vo.Nombre);
       //         comando.Parameters.AddWithValue("p_precio", vo.Precio);
       //         comando.Parameters.AddWithValue("p_id", vo.Id);

       //         // Se toma el valor devuelto
       //         resp = comando.ExecuteScalar().ToString();

       //     }           
       //     catch (Exception Ex)
       //     {
       //         throw Ex;
       //     }

       //     return resp;
       // }

       // public string EstudioEliminar(EstudioVO vo)
       // {
       //     string resp = string.Empty;
       //     try
       //     {
       //         string query = "sp_contaEstudio_eliminar";
       //         MySqlCommand comando = this.Conexion.CreateCommand();                
       //         comando.CommandType = CommandType.StoredProcedure;
       //         comando.CommandText = query;
       //         comando.Parameters.AddWithValue("p_id", vo.Id);

       //         // Se toma el valor devuelto
       //         resp = comando.ExecuteScalar().ToString();

       //     }            
       //     catch (Exception Ex)
       //     {
       //         throw Ex;
       //     }

       //     return resp;
       // }

       // public EstudioVO EstudioObtenerPorClave(int claveEstudio)
       // {
       //     MySqlDataReader dr = null;
       //     EstudioVO vo = null;
       //     try
       //     {
       //         string query = "sp_contaEstudio_selectporclave";
       //         MySqlCommand comando = this.Conexion.CreateCommand();
                
       //         comando.CommandType = CommandType.StoredProcedure;
       //         comando.CommandText = query;
       //         comando.Parameters.AddWithValue("p_id", claveEstudio);

       //         // Se toma el valor devuelto
       //         dr = comando.ExecuteReader();

       //         if (dr.HasRows)
       //         {
       //             dr.Read();
       //             vo = new EstudioVO();
       //             vo.Id = Int32.Parse(dr["Id"].ToString());
       //             vo.Nombre = dr["Nombre"].ToString();
       //             vo.Precio  = Int32.Parse(dr["Id"].ToString());                    
       //         }
       //     }
       //     catch (Exception Ex)
       //     {
       //         throw Ex;
       //     }
       //     finally
       //     {
       //         if (dr != null && !dr.IsClosed)
       //             dr.Close();

       //         dr = null;
       //     }

       //     return vo;
       // }


       // public List<EstudioVO> EstudiosObtenerLista()
       // {
       //     List<EstudioVO> lista = new List<EstudioVO>();
       //     MySqlDataReader dr = null;
       //     try
       //     {
       //         string query = "sp_Estudios_select_lista";
       //         MySqlCommand comando = this.Conexion.CreateCommand();
       //         comando.CommandType = CommandType.StoredProcedure;
       //         comando.CommandText = query;

       //         // Se toma el valor devuelto
       //         dr = comando.ExecuteReader();

       //         if (dr.HasRows)
       //         {
       //             EstudioVO vo;
       //             while (dr.Read())
       //             {
       //                 vo = new EstudioVO();

       //                 vo.Id = dr.GetInt32(dr.GetOrdinal("Id"));
       //                 vo.Nombre = dr["Nombre"].ToString();                        
       //                 vo.Precio = Int32.Parse(dr["Precio"].ToString());
                        

       //                 lista.Add(vo);

       //             }
       //         }

       //     }
       //     catch (Exception Ex)
       //     {
       //         throw Ex;
       //     }
       //     finally
       //     {
       //         if (dr != null && !dr.IsClosed)
       //             dr.Close();

       //         dr = null;
       //     }

       //     return lista;
       // }
       //#endregion
    }

    public abstract class ConectionClass
    {

        public static MySqlConnection connection()
        {

            //MySqlConnection con = new MySqlConnection("Data Source=192.168.0.108; Database=saludD; UID=root; Password=kujJHR85JHM; Port=3308;");

            MySqlConnection con = new MySqlConnection("Data Source=localhost; Database=vendimia; UID=root; Password=123456; Port=3309;");

            return con;

        }
    }
}