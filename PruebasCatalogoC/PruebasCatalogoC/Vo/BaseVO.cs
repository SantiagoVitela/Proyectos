using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebasCatalogoC.Vo
{
    [Serializable]
    public abstract class BaseVO
    {    

        //public String UsuarioLog { get; set; }
        //public String UsuarioID { get; set; }
        //public String AccionLog { get; set; }
        //public String Url { get; set; }

        public int row { get; set; }
        public int total { get; set; }
    }
}