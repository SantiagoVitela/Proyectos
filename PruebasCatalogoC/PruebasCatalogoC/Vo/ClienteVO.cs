using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebasCatalogoC.Vo
{
    public class ClienteVO : BaseVO
    {


        #region Miembros privados

        public string value { get; set; }
        public string text { get; set; }
        private string nombre;
        private string apellidoPaterno;
        private string apellidoMaterno;
        private string nombreCompleto;

        #endregion

        public int Clave { get; set; }        
        public string RFC { get; set; }

        public string Nombre
        {
            get
            {
                return nombre;
            }
            set
            {
                nombre = value;
                nombreCompleto = (nombre + " " + apellidoPaterno + " " + apellidoMaterno).Trim();
            }
        }
        public string ApellidoPaterno
        {
            get
            {
                return apellidoPaterno;
            }
            set
            {
                apellidoPaterno = value;
                nombreCompleto = (nombre + " " + apellidoPaterno + " " + apellidoMaterno).Trim();
            }
        }
        public string ApellidoMaterno
        {
            get
            {
                return apellidoMaterno;
            }
            set
            {
                apellidoMaterno = value;
                nombreCompleto = (nombre + " " + apellidoPaterno + " " + apellidoMaterno).Trim();
            }
        }
        public string NombreCompleto
        {
            get
            {
                return nombreCompleto;
            }
        }
    }


}