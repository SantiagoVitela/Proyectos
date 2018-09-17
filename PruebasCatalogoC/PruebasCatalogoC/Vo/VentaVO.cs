using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebasCatalogoC.Vo
{
    public class VentaVO : BaseVO
    {
        public int Clave { get; set; }
        public int Cliente { get; set; }
        public string ClienteNombre { get; set; }
        public string Fecha { get; set; }
        public string Folio { get; set; }
        public decimal Enganche { get; set; }
        public decimal Bonificacion { get; set; }
        public decimal TotalT { get; set; }
        public int Plazo { get; set; }
    }
}