using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

namespace PruebasCatalogoC.Vo
{
    public class BaseGridVO : BaseVO
    {
        private string _orderBy;
        private string _orderType;

        //string objJavascript, string xmlgrid, string campobusqueda = "", string valorbusqueda = "", int porpagina = 25, int pagina = 0, string orderby = "clave", string ordertype = "asc"
        public string objJavascript { get; set; }
        public string xmlgrid { get; set; }
        public string realPath { get; set; }
        public string campobusqueda { get; set; }
        private string valB = "";
        public int porpagina { get; set; }
        public int pagina { get; set; }
        public string orderby
        {
            get
            {
                return _orderBy;
            }
            set
            {
                Regex r = new Regex("^[\\w]*$");
                if (value != null && !r.IsMatch(value.Trim()))
                {
                    throw new Exception("Valor no permitido para la propiedad OrderBy");
                }

                _orderBy = value;
            }
        }
        public string ordertype
        {
            get
            {
                return _orderType;
            }
            set
            {
                if (value != null)
                {
                    if (value.Trim().ToLower() != "asc" && value.Trim().ToLower() != "desc")
                    {
                        throw new Exception("Valor no permitido para la propiedad OrderType");
                    }
                }

                _orderType = value;
            }
        }
        public BaseGridVO()
        {
            porpagina = 10;
            pagina = 0;
        }
        public string valorbusqueda
        {
            get { return valB; }
            set
            {
                if (value != null)
                {
                    value = Uri.UnescapeDataString(value);

                    valB = value.Replace("'", "\\'").Replace("%", "\\%");

                }
                else
                {
                    valB = "";
                }
            }
        }

    }
}