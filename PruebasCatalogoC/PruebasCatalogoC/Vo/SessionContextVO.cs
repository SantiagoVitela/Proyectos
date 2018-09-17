using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebasCatalogoC.Vo
{
    public class SessionContextVO
    {
        public SessionContextVO()
        {
            //TipoCFD = TipoComprobanteFiscal.Factura;
            VistaActual = VistaSistema.Aplicacion;
        }
        public int EmpresaSeleccionada { get; set; }
        public UsuarioVO Usuario { get; set; }
        //public TipoComprobanteFiscal TipoCFD { get; set; }
        public string ClaveUsuario { get; set; }
        public string Accion { get; set; }
        public string Privilegio { get; set; }
        public VistaSistema VistaActual { get; set; }
        public MenuSistema MnSistema { get; set; }
        public MenuConfiguracion MnConfiguracion { get; set; }

        public bool HasEmpresas { get; set; }

        public int CertificadoSeleccionado { get; set; }
        public string PasswordCertificado { get; set; }
        public DateTime? UltimaRevisionDePasswordCertificado { get; set; }

        public int CertificadoCancelacion { get; set; }
        public string PasswordCertificadoCancelacion { get; set; }
        public DateTime? UltimaRevisionDePasswordCertificadoCancelacion { get; set; }
        public string UrlBase { get; set; }
        /// <summary>
        /// Esta propiedad indica si la aplicación está corriendo en ambiente de producción.
        /// El valor que alimentará a esta propiedad será tomado del archivo web.config, la clave IsProduccion
        /// </summary>
        public bool IsProduccion { get; set; }
        public int IdiomaEtiqueta { get; set; }
        public string Token { get; set; }

    }

    public enum VistaSistema
    {
        Configuracion = 1,
        Aplicacion = 2,
        CapturaEmisorRequerido = 3
    }

    public enum MenuSistema
    {
        Ninguno = 0,
        Catalogo = 1,
        RevisionRoles = 2,
        Recertificacion = 3,
        Revisiones = 4,
        Requerimientos = 5,
        Solicitudes = 6,
        Reportes = 7,
        Activos = 8,
        Altas = 9,
        ControlRiesgos = 10,
        RecertificacionActivos = 11,
        Paquetes = 12,
        IntegracionCorreos = 13,
        MisCuentas = 14,
        AccessCentral = 15,
        AgentesPortal = 16
    }

    public enum MenuConfiguracion
    {
        Ninguno = 0,
        Usuarios = 1,
        Log = 2,
    }
}
