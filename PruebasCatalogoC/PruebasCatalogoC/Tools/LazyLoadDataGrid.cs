using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Xml;
using PruebasCatalogoC.Vo;

namespace BaseCF.Models.Tools
{
    public class LazyLoadDatagrid
    {
        public LazyLoadDatagrid()
        {
            this.show = 10;
        }
        public LazyLoadDatagrid(BaseGridVO f)
        {
            this.show = f.porpagina;
        }
        /**
         * Almacena el html generado
         */
        public StringBuilder stbHtml = new StringBuilder();
        /**
         * Almacena la versión actual del dataGrid
         */
        public String DATAGRID_VERSION = "0.2";
        /**
         * Nombre de la paginación
         */
        public String paginator_name = "div";
        /**
         * Nombre del mensaje de error para datos no encontrados
         */
        public String errorNoDatos = "";
        /**
         * Nombre del mensaje de error interno
         */
        public String errorInterno = "";
        /**
         * Nombre del mensaje de error interno
         */
        public String selectMultiple = "";
        /**
         * Array de datos a mostrar
         * 
         * @var array
         */
        public List<Object> data_source;
        /**
         * show: número de registros en el paginador, por defecto 10.
         * 
         * @var integer
         */
        public int show = 10;

        /**
         * tipoError: tipo de error (1 = datos no encontrados, 2 = error interno)
         * 
         * @var integer
         */
        public int tipoError = 0;
        /**
         * show: número de paginas que se mostraran en el paginador, por defecto 10.
         * 
         * @var integer
         */
        public int showPages = 10;
        /**
         * titulos o cabezeras que se mostra en la tabla <th></th>
         * 
         * @var array
         */
        public Dictionary<String, String> get_fields_and_headers = new Dictionary<String, String>();
        /**
         * campos que se van a mostrar de la base de datos
         * 
         * @var array
         */
        public List<String> fields = new List<String>();
        /**
        * type de campos que se van a mostrar de la base de datos
        * 
        * @var array
        */
        public List<String> types = new List<String>();
        /**
         * usa paginador true or false
         * 
         * @var bool
         */
        public Boolean use_paginator = false;
        /**
         * Array de campos a reenombrar
         */
        public Dictionary<String, Dictionary<String, String>> array_alias = new Dictionary<String, Dictionary<String, String>>();
        /**
         * Array de campos para mostrar
         */
        public Dictionary<String, String> array_show = new Dictionary<String, String>();
        /**
         * Array de campos para funciones
         */
        public Dictionary<String, String> array_funcion = new Dictionary<String, String>();
        /**
         * Array para asignar clases a cada campo de la grilla
         */
        public Dictionary<String, Dictionary<String, String>> array_class = new Dictionary<String, Dictionary<String, String>>();
        /**
         * Array para asignar el ancho a cada columna de la grilla
         */
        public Dictionary<String, String> hmAnchos = new Dictionary<String, String>();
        /**
         * Array para asignar el ancho a las cajas de texto de búsqueda
         */
        public Dictionary<String, String> hmAnchosBusqueda = new Dictionary<String, String>();
        /**
         * Nombre del objeto Javascript (con JSON)
         */
        private String objJavascript;

        /**
         * Nombre del objeto Javascript
         */
        private String name;
        /**
         * Array para saber que campos deben contener una caja de texto para búsqueda
         */
        HashSet<String> hsBusqueda = new HashSet<string>();
        HashSet<String> hsNoSort = new HashSet<string>();


        public string L(string llave)
        {
            string valor = string.Empty;

            
                var e = "";//Etiquetas.FirstOrDefault(m => m.Llave == llave);

                if (e != null)
                {
                    valor = e;
                }
            

            return valor;
        }

        //private Boolean hasAlgoriaNegocios = false;

        // CFExcepcion algoriaNegocios = null;

        /**
         * Construye un DATAGRID que es guardado en la propiedad stbHtml
         * 
         * @param data_source
         *            Arreglo de Objectos que seran pasados como renglones al
         *            datagrid
         * @param path_xml_config
         *            ruta de la configuracion xml
         * @param name
         *            Nombre del objeto javascript, el cual creara un objeto JSON
         */
        public void regresaLazyLoadDatagrid(String path_xml_config, String name, List<Object> data_source)
        {
            try
            {
                this.name = name;
                this.data_source = data_source;
                //this.data_source = null;
                //String type = this.data_source[0].GetType().Name;
                //if (type.Equals("AlgoriaNegocios"))
                //{
                //    algoriaNegocios = (AlgoriaNegocios)this.data_source[0];
                //    this.data_source.RemoveRange(0,1);
                //    this.hasAlgoriaNegocios = true;
                //}
                if (data_source == null || data_source.Count < 2)
                    tipoError = 1;
                totalElements = int.Parse(data_source[data_source.Count - 1].ToString());
                //if (totalElements < 2)
                if (totalElements < 1)
                    tipoError = 1;
                this.objJavascript = name + "JSON";
                if (getConfig(path_xml_config))
                {
                    makeTable();
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("** LazyLoadDatagrid2 **");
                System.Diagnostics.Debug.WriteLine(e.StackTrace);
                tipoError = 1;
                this.objJavascript = name + "JSON";
                if (getConfig(path_xml_config))
                {
                    makeTable();
                }
                //throw e;
            }
        }


        public int getTotalElementos()
        {
            return this.totalElements;
        }

        /**
         * Construye un DATAGRID que es guardado en la propiedad stbHtml
         * 
         * @param data_source
         *            Lista de Objectos que seran pasados como renglones al datagrid
         * @param path_xml_config
         *            ruta de la configuracion xml
         * @param name
         *            Nombre del objeto javascript, el cual creara un objeto JSON
         */
        int totalElements = 0;

        public void inicializaLazyLoadDatagrid(String path_xml_config, String name, List<Object> data_source)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("Total: " + data_source.Count);
                this.name = name;

                if (data_source == null || data_source.Count < 2)
                    tipoError = 2;
                totalElements = int.Parse(data_source[data_source.Count - 1].ToString());
                if (totalElements < 1)
                    tipoError = 1;
                System.Diagnostics.Debug.WriteLine("Total: " + totalElements);
                this.objJavascript = name + "JSON";
                if (getConfig(path_xml_config))
                {
                    this.data_source = totalElements < this.show ? data_source : data_source.GetRange(0, this.show);
                    makeTable();
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("** LazyLoadDatagrid1 **");
                System.Diagnostics.Debug.WriteLine(e.StackTrace);
                tipoError = 2;
                this.objJavascript = name + "JSON";
                if (getConfig(path_xml_config))
                {
                    makeTable();
                }
            }
        }



        /**
         * Verifica los datos si no existe registros.
         * 
         * @return true si existen datos a mostrar en el grid , false contrario
         */
        public Boolean checkData()
        {
            if (this.data_source.Count <= 1)
            {
                if (this.data_source.Count <= 0)
                {
                    stbHtml.Append("<span> Hubo un error </span>");
                }
                else
                    stbHtml.Append("<span> Error </span>");
                return false;
            }
            else
            {
                data_source.Remove(0);
            }
            return true;
        }

        /**
         * Verifica si el campo tiene un alias asignado dependiendo su valor
         * 
         * @param field
         *            campo a verificar
         * @param value
         *            valor condicionado
         * @return alias , su valor caso contrario
         */
        public String getAlias(String field, String value)
        {
            if (array_alias.ContainsKey(field))
            {
                Dictionary<String, String> map = new Dictionary<String, String>(array_alias[field]);
                if (map.ContainsKey(value))
                {
                    value = map[value];
                }
            }
            return value;
        }

        /**
         * Verifica si el campo tiene un clase css asignado dependiendo su valor
         * 
         * @param field
         *            campo a verificar
         * @param value
         *            valor condicionado
         * @return clase css , cadena vacia caso contrario
         */

        public String getCss(String field, String value)
        {
            if (array_class.ContainsKey(field))
            {
                Dictionary<String, String> map = new Dictionary<String, String>(array_class[field]);
                if (map.ContainsKey(value))
                {
                    value = map[value];
                    return value;
                }
            }
            return "";
        }

        /**
         * Obtiene el valor de la propiedad
         * 
         * @param clase
         *            clase POJO
         * @param propiedad
         *            se l clase POJO
         * @return Objeto y null si no se encontro la propiedad
         */
        private static Object obtenerValor(Object clase, String propiedad)
        {
            try
            {
                Type c = clase.GetType();
                PropertyInfo property = c.GetProperty(toFirstUpperCase(propiedad));
                return property.GetValue(clase, null);
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("(obtenerValor): " + e.StackTrace);
                return null;
            }
        }

        /**
         * Convierte la cadena en CapitalLetter
         * 
         * @param texto
         *            texto a convertir
         * @return true si se puede mostrar
         */
        private static String toFirstUpperCase(String texto)
        {
            if (texto.Length > 1)
            {
                texto = texto.Substring(0, 1).ToUpper() + texto.Substring(1);
            }
            return texto;
        }

        /**
         * Verifica si el campo tiene una funcion asignada
         * 
         * @param field
         *            campo a verificar
         * @param value
         *            texto a mostrar
         * @param i
         *            pos i en el objetoJavascript
         * @return true si se puede mostrar
         */
        private String getFuncion(String field, String value, int i, int aux)
        {
            try
            {
                if (array_funcion.ContainsKey(field))
                {
                    if (field.Equals(value) && value.Contains("_nosort"))
                        value = value.Replace("_nosort", "");
                    return "<a href=\"javascript:" + this.name + "." + array_funcion[field] + "('" + i + "')\">" + value + "</a>";
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("** getFunction **");
                System.Diagnostics.Debug.WriteLine(e.StackTrace);
            }
            if (field.Equals(value) && value.Contains("_nosort"))
                return "";
            if (aux == 1)
            {
                return "";
            }
            return value;
        }


        /**
         * Verifica si el campo se debe de mostrar
         * 
         * @param field
         *            campo a verificar
         * @return true si se puede mostrar
         */
        private Boolean isVisible(Object field)
        {
            return Boolean.Parse(this.array_show[field.ToString()].ToString());
        }

        /**
         * Obtiene la configuración del xml
         * 
         * @param file
         *            archivo xml que se le substrae la información
         * @return true si no hubo errores de lectura
         */
        public Boolean getConfig(String file)
        {
            try
            {
                XmlDocument xDoc = new XmlDocument();

                //La ruta del documento XML permite rutas relativas
                //respecto del ejecutable!



                xDoc.Load(file);
                xDoc.Normalize();

                XmlNodeList listaColumnas = xDoc.GetElementsByTagName("columna");
                XmlNodeList listaConfig = xDoc.GetElementsByTagName("config");

                for (int i = 0; i < listaConfig.Count; i++)
                {
                    XmlNode config = listaConfig[i];
                    //if (config.GetType() == XmlElement) {
                    XmlElement elemento = (XmlElement)config;
                    this.use_paginator = Boolean.Parse(getTagValue("paginacion", elemento));

                    this.errorNoDatos = getTagValue("errornodatos", elemento);
                    this.selectMultiple = getTagValue("selectMultiple", elemento);
                    //if (this.selectMultiple == null || this.selectMultiple.Equals(""))

                    this.errorInterno = getTagValue("errorinterno", elemento);

                    if (this.selectMultiple == null)
                        this.selectMultiple = "false";
                    if (this.errorNoDatos == null)
                        this.errorNoDatos = L("Grid.General.errorNoDatos") == string.Empty ? "No se encontraron registros" : L("Grid.General.errorNoDatos");
                    if (this.errorInterno == null)
                        this.errorInterno = L("Grid.General.errorInterno") == string.Empty ? "Error en la recuperaci&oacuten de los registros" : L("Grid.General.errorInterno");  

                    if (use_paginator)
                    {
                        //this.show = Int32.Parse(getTagValue("porPagina", elemento));
                        try
                        {
                            this.showPages = Int32.Parse(getTagValue("paginasVisibles", elemento));
                        }
                        catch (Exception e)
                        {
                            this.showPages = 10;
                            Console.WriteLine(e.Message);
                        }
                        this.paginator_name = getTagValue("tipo", elemento);
                    }
                    //}
                }
                for (int i = 0; i < listaColumnas.Count; i++)
                {
                    String field = null;
                    String header = null;
                    String css = null;
                    String alias = null;
                    String busqueda = null;
                    String ancho = null;
                    String anchoBusqueda = null;
                    String activo = null;
                    String funcion = null;
                    String text = null;
                    String tipo = null;
                    XmlNode columna = listaColumnas[i];
                    //	if (columna.GetType() == XmlNode.ELEMENT_NODE) {
                    XmlElement elemento = (XmlElement)columna;
                    field = getTagValue("field", elemento);
                    text = getTagValue("text", elemento);
                    if (field != null || text != null)
                    {
                        header = getTagValue("header", elemento);
                        var customHeader = getTagValue("IsCustomheader", elemento);
                        if (customHeader != null && customHeader.ToLower().Equals("true"))
                        {
                            header = L(header);
                            text = L(text) == string.Empty ? text : L(text);
                        }
                        if (text != null)
                            field = text + "_nosort";
                        else
                        {
                            String sort = getTagValue("sort", elemento);

                            if (sort != null && sort.ToLower().Equals("false"))
                                //field = field + "_nosort";
                                hsNoSort.Add(field);
                        }

                        if (header != null)
                        {
                            get_fields_and_headers.Add(field, header);
                            fields.Add(field);
                        }
                        alias = getTagValue("alias", elemento);
                        if (alias != null)
                        {
                            array_alias.Add(field, rule(alias));
                        }
                        activo = getTagValue("activo", elemento);

                        if (activo != null)
                        {
                            array_show.Add(field, activo);
                        }
                        busqueda = getTagValue("busqueda", elemento);
                        if (busqueda != null && busqueda.ToLower().Equals("true"))
                        {
                            hsBusqueda.Add(field);
                        }
                        ancho = getTagValue("ancho", elemento);
                        if (ancho != null)
                        {
                            hmAnchos.Add(field, ancho);
                        }
                        else
                        {
                            hmAnchos.Add(field, "200px");
                        }

                        tipo = getTagValue("type", elemento);
                        if (tipo != null)
                        {
                            types.Add(tipo);
                        }
                        else
                        {
                            types.Add("");
                        }

                        anchoBusqueda = getTagValue("tamaniobusqueda", elemento);
                        if (anchoBusqueda != null)
                        {
                            hmAnchosBusqueda.Add(field, anchoBusqueda);
                        }

                        css = getTagValue("class", elemento);
                        if (css != null)
                        {
                            array_class.Add(field, rule(css));
                        }
                        funcion = getTagValue("funcion", elemento);
                        if (funcion != null)
                        {
                            array_funcion.Add(field, funcion);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("** config2 **");
                System.Diagnostics.Debug.WriteLine(e.StackTrace);
                tipoError = 2;
                throw e;

            }
            return true;
        }


        /**
         * Obtiene el contenido de la etiqueta del elemento
         * 
         * @param sTag
         *            etiqueta del elemento
         * @param eLement
         *            elemnto al que se le substrae la etiqueta
         * @return String si encontro la etiqueta y null si no la encontro
         */
        private static String getTagValue(String sTag, XmlElement eElement)
        {
            XmlNodeList existe = eElement.GetElementsByTagName(sTag);
            if (existe.Count > 0)
            {
                XmlNodeList nlList = eElement.GetElementsByTagName(sTag)[0].ChildNodes;
                XmlNode nValue = (XmlNode)nlList[0];
                return nValue.Value;
            }
            return null;
        }

        /**
         * Crea una regla
         * 
         * @param regla
         *            cadena con la regla 1,Activo la regla es 1 sea = Activo
         * @return Hashmap donde key es el indicador
         */
        private static Dictionary<String, String> rule(String regla)
        {
            Dictionary<String, String> reglaHM = new Dictionary<String, String>();
            String[] separador1 = regla.Split('|');
            for (int i = 0; i < separador1.Length; i++)
            {
                String[] separador2 = separador1[i].Split(',');
                reglaHM.Add(separador2[0], separador2[1]);
            }
            return reglaHM;
        }

        /**
         * forma la tabla html con la información de la clase
         */
        public void makeTable()
        {
            try
            {
                String cssClass = "";
                System.Web.Script.Serialization.JavaScriptSerializer oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
                string sJSON = oSerializer.Serialize(data_source);
                String scriptPaginas = "sin error<script>";
                if (tipoError == 1)
                {
                    scriptPaginas = "1<script>";
                }
                if (tipoError == 2)
                {
                    scriptPaginas = "2<script>";
                }
                scriptPaginas += objJavascript + "=" + sJSON + ";<script>";
                stbHtml.Append(scriptPaginas);
                stbHtml.Append("<div id=\"grid_" + this.name + "\" class=\"generalgrid\" >");
                stbHtml.Append("<div class=\"container\">");
                stbHtml.Append("<table class=\"llsortable\">");
                stbHtml.Append(" <thead>");
                stbHtml.Append("  <tr>");

                for (int i = 0; i < fields.Count; i++)
                {
                    if (this.isVisible(fields[i]))
                    {
                        String head = this.get_fields_and_headers[fields[i]];
                        if (!(fields[i].Contains("_nosort") || hsNoSort.Contains(fields[i])))
                            head = "<a href='#' onClick='return false;'>" + head + "</a>";
                        if (hmAnchos.ContainsKey(fields[i]))
                            stbHtml.Append("<th id='" + (hsNoSort.Contains(fields[i]) ? fields[i] + "_nosort" : fields[i]) + "' width='" + hmAnchos[fields[i]] + "' title='Ordenar'> " + head + " </th>");
                        else
                            stbHtml.Append("<th id='" + (hsNoSort.Contains(fields[i]) ? fields[i] + "_nosort" : fields[i]) + "' title='Ordenar'> " + head + " </th>");
                    }
                }
                stbHtml.Append("  </tr>");
                stbHtml.Append(" </thead>");
                stbHtml.Append("<tbody >");
                stbHtml.Append("<tr class='trsearch' >");

                for (int i = 0; i < fields.Count; i++)
                {
                    if (this.isVisible(fields[i]) && fields[i] != null)
                    {
                        if (fields[i].Contains("_nosort") || !hsBusqueda.Contains(fields[i]))
                        {
                            stbHtml.Append("<td class='trbusqueda' ></td>");
                        }
                        else
                        {
                            String head = fields[i];
                            String anchoBusqueda = "";
                            if (hmAnchosBusqueda.ContainsKey(head))
                            {
                                anchoBusqueda = hmAnchosBusqueda[head];
                            }
                            else
                            {
                                anchoBusqueda = "10";
                            }

                            stbHtml.Append("<td class='trbusqueda' nowrap='nowrap'><input type='textfield' typ='tsearch' size='" + anchoBusqueda + "' id='search_" + head + "' size=\"13\" header='" + head + "' onkeydown=\"if (event.keyCode == 13){ " + name + ".gridSearch('" + head + "');}\"/>");
                            stbHtml.Append("<div id='cleanicon_" + head + "' class='cleanbox' onClick=\"javascript:" + name + ".gridSearchReset('" + head + "');\"></div>");
                            stbHtml.Append("<div id='searchicon_" + head + "' class='searchbox' onClick=\"javascript:" + name + ".gridSearch('" + head + "');\"></div></td>");
                        }
                    }
                }
                stbHtml.Append("  </tr>");
                //}
                //else
                //{

                //}
                stbHtml.Append("</tbody >");
                if (tipoError == 1)
                {
                    stbHtml.Append("<tbody >");
                    stbHtml.Append("<tr><td colspan='" + fields.Count + "' style='text-align:center' >" + errorNoDatos + "</td><tr></tbody></table>");
                    return;
                }
                if (tipoError == 2)
                {
                    stbHtml.Append("<tbody >");
                    stbHtml.Append("<tr><td colspan='" + fields.Count + "' style='text-align:center' >" + errorNoDatos + "</td><tr></tbody></table>");
                    return;
                }
                //stbHtml.Append("<tbody class=\"showPage\">");
                stbHtml.Append("<tbody>");
                int zebra = 0;
                for (int i = 0; i < show; i++)
                {
                    if (i == data_source.Count - 1)
                    {
                        break;
                    }
                    Object objeto = data_source[i];
                    if (zebra == show && use_paginator)
                        zebra = 0;
                    if (zebra % 2 == 0)
                        stbHtml.Append("<tr ondblclick='" + name + ".dobleClick(" + objJavascript + "[" + i + "])'  onmouseover='" + name + ".mouseover(" + i + ")' onmouseout='" + name + ".mouseout()' id='" + name + "-tr" + i + "' class='odd' onClick='" + name + ".gridControlSelectItem(" + objJavascript + "," + i + ")' position='" + i + "'>");
                    else
                        stbHtml.Append("<tr ondblclick='" + name + ".dobleClick(" + objJavascript + "[" + i + "])'  onmouseover='" + name + ".mouseover(" + i + ")' onmouseout='" + name + ".mouseout()' id='" + name + "-tr" + i + "' onClick='" + name + ".gridControlSelectItem(" + objJavascript + "," + i + ")' position='" + i + "'>");
                    for (int j = 0; j < fields.Count; j++)
                    {
                        if (isVisible(fields[j]))
                        {
                            Object valor = obtenerValor(objeto, fields[j]);
                            if (valor != null)
                                cssClass = getCss(fields[j], valor.ToString());
                            if (cssClass != null && cssClass.Length > 0)
                                cssClass = "class =\"" + cssClass + "\"";
                            if (valor != null)
                            {
                                valor = getAlias(fields[j], valor.ToString());
                                valor = valor.ToString().Replace("\u00e1", "&aacute");
                                valor = valor.ToString().Replace("\u00e9", "&eacute");
                                valor = valor.ToString().Replace("\u00ed", "&iacute");
                                valor = valor.ToString().Replace("\u00f3", "&oacute");
                                valor = valor.ToString().Replace("\u00fa", "&uacute");
                                valor = valor.ToString().Replace("\u00f1", "&ntilde");
                                valor = valor.ToString().Replace("\u00c1", "&Aacute");
                                valor = valor.ToString().Replace("\u00c9", "&Eacute");
                                valor = valor.ToString().Replace("\u00cd", "&Iacute");
                                valor = valor.ToString().Replace("\u00d3", "&Oacute");
                                valor = valor.ToString().Replace("\u00da", "&Uacute");
                                valor = valor.ToString().Replace("\u00d1", "&Ntilde");
                            }

                            if (valor != null)
                            {
                                if (types[j] == "textbox")
                                {
                                    stbHtml.Append("    <td " + cssClass + "><input id=\"" + fields[j] + "-" + i + "\" maxlength=\"4\" data-type=\"number,2\" type=\"text\" name=\"" + fields[j] + "\" value=\"" + this.getFuncion(fields[j], valor.ToString(), i, 0) + "\"></input></td>");
                                }
                                else if (types[j] == "textboxtext")
                                {
                                    stbHtml.Append("    <td " + cssClass + "><input id=\"" + fields[j] + "-" + i + "\" maxlength=\"150\" type=\"text\" name=\"" + fields[j] + "\" value=\"" + this.getFuncion(fields[j], valor.ToString(), i, 0) + "\"></input></td>");
                                }
                                else if (types[j] == "checkbox")
                                {
                                    stbHtml.Append("    <td " + cssClass + "><input id=\"" + fields[j] + "-" + i + "\" type=\"checkbox\" name=\"" + fields[j] + "\" value=\"" + this.getFuncion(fields[j], valor.ToString(), i, 0) + "\" " + (valor.ToString() == "1" ? "checked" : "") + " ></input></td>");
                                }
                                else
                                {
                                    stbHtml.Append("    <td " + cssClass + ">" + this.getFuncion(fields[j], valor.ToString(), i, 0) + "</td>");
                                }
                            }
                            else
                            {
                                stbHtml.Append("    <td " + cssClass + ">" + this.getFuncion(fields[j], fields[j], i, 1) + "</td>");
                            }
                            cssClass = "";
                        }

                    }
                    stbHtml.Append("</tr>");
                    zebra++;
                }
            }
            catch (Exception e)
            {
                System.Diagnostics.Debug.WriteLine("** maketable Exception **");
                System.Diagnostics.Debug.WriteLine(e.StackTrace);
                System.Diagnostics.Debug.WriteLine(e.Message);

                //e.printStackTrace();
            }
            stbHtml.Append("</tbody>");
            stbHtml.Append(" </table>");
            stbHtml.Append("<input type='hidden' name='use_paginator' value=\"" + this.use_paginator + "\" />");
            stbHtml.Append("<input type='hidden' name='show_per_page' value=\"" + this.show + "\" />");
            stbHtml.Append("<input type='hidden' name='show_pages' value=\"" + this.showPages + "\" />");
            stbHtml.Append("<input type='hidden' name='select_multiple' value=\"" + this.selectMultiple + "\" />");

            stbHtml.Append("<input type='hidden' name='number_of_items' value=\"" + totalElements + "\" />");
            // stbHtml.append("<input type='hidden' name='number_of_items' value=\""
            // + data_source.size() + "\" />");
            stbHtml.Append("</div>");
            stbHtml.Append("<div class='paginacion'></div>");
            stbHtml.Append("</div>");
        }

        public void regresaError(String path_xml_config, String name)
        {
            regresaLazyLoadDatagrid(path_xml_config, name, null);
        }
    }
}
