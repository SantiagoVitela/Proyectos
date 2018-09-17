using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebasCatalogoC.Vo
{
    public class ConfiguracionVO
    {
        public int Clave { get; set; }
        public decimal Tasa { get; set; }
        public decimal PorcEnganche { get; set; }
        public int PlazoMaximo { get; set; }
    }
}