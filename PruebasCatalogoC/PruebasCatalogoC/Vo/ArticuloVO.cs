using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebasCatalogoC.Vo
{
    public class ArticuloVO : BaseVO
    {

        public int Clave { get; set; }
        public string Descripcion { get; set; }
        public string Modelo { get; set; }
        public decimal Precio { get; set; }
        public int Existencia { get; set; }

        public string value { get; set; }
        public string text { get; set; }
    }

    public class ArticuloVentaVO : ArticuloVO
    {
        public ArticuloVentaVO()
        { }
        public ArticuloVentaVO(ArticuloVO vo)
        {
            this.Clave = vo.Clave;
            this.Descripcion = vo.Descripcion;
            this.Modelo = vo.Modelo;
            this.Precio = vo.Precio;
            this.Cantidad = 1;
        }
        public int Cantidad { get; set; }
        public decimal PrecioReal { get; set; }
        public decimal Importe { get; set; }
    }
}