using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;

namespace PruebasCatalogoC.Excepciones
{
    [Serializable]
    public class CCExcepcion : Exception
    {
        private string _stackTrace = null;
        public string MensajeUsuario { get; set; }
        public string innerEx { get; set; }
        public CCExcepcionResultado Resultado { get; set; }
        public List<CCExcepcionErrorDetail> ErrorForm { get; set; }

        public override string StackTrace
        {
            get
            {
                return _stackTrace;
            }
        }


        public string TipoExcepcion { get; set; }
        public int Clave{ get; set; }
        private string titulo = string.Empty;
 
        public CCExcepcion()
            : base()
        {
            this.Resultado = CCExcepcionResultado.ErrorDesconocido;
            this.MensajeUsuario = "Error desconocido.";
            TipoExcepcion = this.GetType().Name;
            CreateStackTrace();
        }
        
        public CCExcepcion(string message)
            : base(message)
        {
            this.Resultado = CCExcepcionResultado.ErrorDesconocido;
            this.MensajeUsuario = message;
            TipoExcepcion = this.GetType().Name;
            CreateStackTrace();
        }

        public CCExcepcion(CCExcepcionResultado resultado, string message)
            : base(message)
        {
            this.Resultado = resultado;
            this.MensajeUsuario = message;
            TipoExcepcion = this.GetType().Name;
            CreateStackTrace();
        }

        public CCExcepcion(Exception ex)
            : base(ex.Message)
        {
            this.Resultado = CCExcepcionResultado.ErrorDesconocido;
            this.MensajeUsuario = ex.Message;
            this.innerEx = ex.InnerException != null ? (ex.InnerException.Message.Length > 1000 ? ex.InnerException.Message.Substring(0, 1000) : ex.InnerException.Message) : ex.Message;
            TipoExcepcion = this.GetType().Name;
            _stackTrace = ex.StackTrace;

            //this.MensajeUsuario = "Error desconocido. Por favor, revise el log de errores para más información.";
        }
        public CCExcepcion(string titulo, string mensajeUsuario, Exception ex)
        {
            this.Resultado = CCExcepcionResultado.ERROR_INTERNO;
            this.MensajeUsuario = mensajeUsuario;
            this.TipoExcepcion = ex.GetType().Name;
        }
        public CCExcepcion(int clave, string titulo, string mensajeUsuario)
        {
            this.Clave = clave;
            this.titulo = titulo;
            this.MensajeUsuario = mensajeUsuario;
            this.TipoExcepcion = this.GetType().Name;
            this.Resultado = CCExcepcionResultado.ERROR_SINPERMISO;

            CreateStackTrace();
        }
        // Constructor needed for serialization 
        // when exception propagates from a remoting server to the client.
        protected CCExcepcion(System.Runtime.Serialization.SerializationInfo info,
        System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        #region Métodos privados

        private void CreateStackTrace()
        {
            StackTrace st = new StackTrace(true);
            StringBuilder sb = new StringBuilder();
            for (int i = 2; i < st.FrameCount; i++)
            {
                StackFrame sf = st.GetFrame(i);
                sb.AppendFormat("   at {0} in {1}: line {2}", sf.GetMethod(), sf.GetFileName(), sf.GetFileLineNumber());

                if (i == 4)
                {
                    break;
                }
            }

            _stackTrace = sb.ToString();
        }

        #endregion  
    }

    public enum CCExcepcionResultado
    {
        Exito = 0,
        ErrorDesconocido = -1,
        ErrorFormulario = -2,
        ERROR_INTERNO = 2,
        ActivacionUsuarioYaActivo = -3,
        ActivacionLinkNoValido = -4,
        
        ERROR_SINPERMISO = -5,

        EncuestaNoConfigurada = -20
    }

    public class CCExcepcionErrorDetail
    {
        public string Clave { get; set; }
        public string Campo { get; set; }
        public string Texto { get; set; }
        public string MensajeUsuario { get; set; }

        public List<object> ErrorList { get; set; }
    }
}
