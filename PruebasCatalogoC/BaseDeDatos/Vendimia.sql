/*
SQLyog Ultimate v8.55 
MySQL - 5.7.14-log : Database - vendimia
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`vendimia` /*!40100 DEFAULT CHARACTER SET utf8 */;

/*Table structure for table `articulos` */

DROP TABLE IF EXISTS `articulos`;

CREATE TABLE `articulos` (
  `Clave` int(5) NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(100) DEFAULT NULL,
  `Modelo` varchar(100) DEFAULT NULL,
  `Precio` decimal(12,2) DEFAULT NULL,
  `Existencia` int(5) DEFAULT NULL,
  PRIMARY KEY (`Clave`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `articulos` */

LOCK TABLES `articulos` WRITE;

insert  into `articulos`(`Clave`,`Descripcion`,`Modelo`,`Precio`,`Existencia`) values (1,'Television','Modelo','3900.00',2),(2,'Sillon de madera','Sal-100','5500.00',5);

UNLOCK TABLES;

/*Table structure for table `clientes` */

DROP TABLE IF EXISTS `clientes`;

CREATE TABLE `clientes` (
  `Clave` int(5) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) DEFAULT NULL,
  `ApPaterno` varchar(100) DEFAULT NULL,
  `ApMaterno` varchar(100) DEFAULT NULL,
  `RFC` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Clave`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `clientes` */

LOCK TABLES `clientes` WRITE;

insert  into `clientes`(`Clave`,`Nombre`,`ApPaterno`,`ApMaterno`,`RFC`) values (1,'Santiagos','Vitelas','Guichos','SVIG120787'),(2,'Aracely','Valenzuela','Alvarado','VALA040796'),(3,'Carlos Alberto','Vitela','Plata','VPLCAL240607');

UNLOCK TABLES;

/*Table structure for table `configuracion` */

DROP TABLE IF EXISTS `configuracion`;

CREATE TABLE `configuracion` (
  `Clave` int(5) NOT NULL AUTO_INCREMENT,
  `Tasa` decimal(12,2) DEFAULT NULL,
  `PorcEnganche` decimal(12,2) DEFAULT NULL,
  `PlazoMaximo` int(5) DEFAULT NULL,
  PRIMARY KEY (`Clave`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `configuracion` */

LOCK TABLES `configuracion` WRITE;

insert  into `configuracion`(`Clave`,`Tasa`,`PorcEnganche`,`PlazoMaximo`) values (1,'1.50','20.00',12);

UNLOCK TABLES;

/*Table structure for table `ventas` */

DROP TABLE IF EXISTS `ventas`;

CREATE TABLE `ventas` (
  `Clave` int(5) NOT NULL AUTO_INCREMENT,
  `Folio` varchar(6) DEFAULT NULL,
  `Cliente` int(5) DEFAULT NULL,
  `Plazo` int(5) DEFAULT NULL,
  `Enganche` decimal(12,2) DEFAULT NULL,
  `TotalT` decimal(12,2) DEFAULT NULL,
  `Bonificacion` decimal(12,2) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`Clave`),
  KEY `Cliente` (`Cliente`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`Cliente`) REFERENCES `clientes` (`Clave`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `ventas` */

LOCK TABLES `ventas` WRITE;

insert  into `ventas`(`Clave`,`Folio`,`Cliente`,`Plazo`,`Enganche`,`TotalT`,`Bonificacion`,`fecha`) values (1,'000001',1,6,'885.30','119.52','3421.68','2018-09-16 00:00:00');

UNLOCK TABLES;

/* Procedure structure for procedure `sp_articulos_select_lista` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_articulos_select_lista` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_articulos_select_lista`(
	p_campobusqueda CHAR(100), 
	p_valorbusqueda CHAR(50), 
	p_numeropagina INT, 
	p_porpagina INT, 
	p_orderby CHAR(40), 
	p_ordertype CHAR(4)    
    )
BEGIN
DECLARE strSQL VARCHAR(65535);
	DECLARE whereSQL VARCHAR(100);
	
	SET whereSQL = '';
	
	
    	IF p_campobusqueda IS NULL THEN SET p_campobusqueda = ''; END IF;
	IF p_valorbusqueda IS NULL THEN SET p_valorbusqueda = ''; END IF;
	SET strSQL = CONCAT('SELECT * FROM 
				(  SELECT *					
					FROM articulos tc 
					',
                                whereSQL,' ) a ');
				
	IF(p_campobusqueda <> '') THEN
		SET strSQL = CONCAT(strSQL, ' WHERE ', p_campobusqueda, ' LIKE ''', p_valorbusqueda, '%''');
	END IF;
	
	CALL sp_obtienedatosporseccion2(strSQL, p_numeropagina, p_porpagina, p_orderby, p_ordertype) ;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_articulo_actualizar` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_articulo_actualizar` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_articulo_actualizar`(
	p_descripcion varchar(100),
	p_modelo  varchar(100),
	p_precio  decimal(12,2),
	p_existencia  int,
	p_clave int
	
    )
BEGIN
    
	update articulos set 
		descripcion= p_descripcion,
		modelo=p_modelo,
		precio = p_precio,
		existencia = p_existencia
		where clave = p_clave;
		select p_clave;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_articulo_crear` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_articulo_crear` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_articulo_crear`(
	p_descripcion VARCHAR(100),
	p_modelo  VARCHAR(100),
	p_precio  DECIMAL(12,2),
	p_existencia  INT
	
	
    )
BEGIN
	INSERT INTO articulos(descripcion,modelo,precio,existencia)
			values(p_descripcion,
					p_modelo,
					p_precio,
					p_existencia);
					
					select max(clave) from articulos;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_articulo_selectporclave` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_articulo_selectporclave` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_articulo_selectporclave`(	
	p_clave int
	
    )
BEGIN
    
	select c.* from articulos c
		
	where c.clave = p_clave;
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_clientes_select_lista` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_clientes_select_lista` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_clientes_select_lista`(
	p_campobusqueda CHAR(100), 
	p_valorbusqueda CHAR(50), 
	p_numeropagina INT, 
	p_porpagina INT, 
	p_orderby CHAR(40), 
	p_ordertype CHAR(4)    
    )
BEGIN
DECLARE strSQL VARCHAR(65535);
	DECLARE whereSQL VARCHAR(100);
	
	SET whereSQL = '';
	
	
    	IF p_campobusqueda IS NULL THEN SET p_campobusqueda = ''; END IF;
	IF p_valorbusqueda IS NULL THEN SET p_valorbusqueda = ''; END IF;
	SET strSQL = CONCAT('SELECT * FROM 
				(  SELECT *					
					FROM clientes tc 
					',
                                whereSQL,' ) a ');
				
	IF(p_campobusqueda <> '') THEN
		SET strSQL = CONCAT(strSQL, ' WHERE ', p_campobusqueda, ' LIKE ''', p_valorbusqueda, '%''');
	END IF;
	
	CALL sp_obtienedatosporseccion2(strSQL, p_numeropagina, p_porpagina, p_orderby, p_ordertype) ;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_Cliente_actualizar` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_Cliente_actualizar` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Cliente_actualizar`(
	p_nombre varchar(100),
	p_apaterno  varchar(100),
	p_amaterno  varchar(100),
	p_rfc  varchar(50),
	p_clave int
	
    )
BEGIN
    
	update clientes set 
		nombre= p_nombre,
		appaterno=p_apaterno,
		apmaterno = p_amaterno,
		rfc = p_rfc
		where clave = p_clave;
		select p_clave;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_Cliente_crear` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_Cliente_crear` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Cliente_crear`(
	p_nombre varchar(100),
	p_apaterno  varchar(100),
	p_amaterno  varchar(100),
	p_rfc  varchar(50)
	
	
    )
BEGIN
	INSERT INTO clientes(nombre,appaterno,apmaterno,rfc)
			values(p_nombre,
					p_apaterno,
					p_amaterno,
					p_rfc);
					
					select max(clave) from clientes;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_Cliente_selectporclave` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_Cliente_selectporclave` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Cliente_selectporclave`(	
	p_clave int
	
    )
BEGIN
    
	select c.* from clientes c
		
	where c.clave = p_clave;
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_configuracion_actualizar` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_configuracion_actualizar` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_configuracion_actualizar`(
	p_tasa DECIMAL(12,2),
	p_PorcEnganche  decimal(12,2),
	p_PlazoMaximo  int,
	p_clave int
	
    )
BEGIN
    
	update configuracion set 
		tasa	= p_tasa,
		PorcEnganche=p_PorcEnganche,
		PlazoMaximo = p_PlazoMaximo		
		where clave = p_clave;		
		select p_clave;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_configuracion_crear` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_configuracion_crear` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_configuracion_crear`(
	p_tasa DECIMAL(12,2),
	p_PorcEnganche  DECIMAL(12,2),
	p_PlazoMaximo  INT
	
	
    )
BEGIN
	INSERT INTO configuracion(tasa,PorcEnganche,PlazoMaximo)
			values(p_tasa,
					p_PorcEnganche,
					p_PlazoMaximo
					);
					
					select max(clave) from configuracion;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_Configuracion_select` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_Configuracion_select` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Configuracion_select`(	
	
	
    )
BEGIN
    
	select c.* from configuracion c	;
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_obtienedatosporseccion2` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_obtienedatosporseccion2` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_obtienedatosporseccion2`(
	p_strSelectTabla VARCHAR(65535), 
	p_numeropagina integer, 
	p_porpagina integer, 
	p_orderby VARchar(40), 
	p_ordertype char(4)
    )
BEGIN
	
	-- Default WITH (NOLOCK)
	SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED ;
	
	if p_orderby is null then
		set p_orderby = 'clave';
	END if;
	if p_ordertype is null then
		set p_ordertype = 'asc';
	end if;
	
	
	if p_orderby is not null and p_orderby != '' then
		IF p_ordertype IS NOT NULL AND p_ordertype != '' THEN
			set p_strSelectTabla = concat(p_strSelectTabla,' ORDER BY ', p_orderby,' ',p_ordertype);
		end if;
	end if;
	
	
	
	SET @total = 0;
	SET @strCount = CONCAT('SELECT count(*) INTO @total FROM (', p_strSelectTabla ,')a;');
	PREPARE stmtCount FROM @strCount;
	EXECUTE stmtCount;
	deallocate prepare stmtCount;	
	
	SET @strSQL = CONCAT('select *, ', @total ,' as total from (
				select @i:=@i+1 as row, tabla.* '
				'from (',
				p_strSelectTabla,
				')tabla,(SELECT @i:=0) foo
			) tabla2 '
			'WHERE 1=1 '
			' AND row > ',p_numeroPagina* p_porpagina,
			' AND row <= ',(p_numeroPagina* p_porpagina) + p_porpagina
			-- ' ORDER BY ',p_orderby,' ',p_ordertype
		);
	prepare stmt FROM @strSQL;
	-- select @strSQL;
	execute stmt;
	deallocate prepare stmt;
	
	-- SE elimina el default WITH (NOLOCK)
	SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ ;
	
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_Ventas_select_lista` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_Ventas_select_lista` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Ventas_select_lista`(
	p_campobusqueda CHAR(100), 
	p_valorbusqueda CHAR(50), 
	p_numeropagina INT, 
	p_porpagina INT, 
	p_orderby CHAR(40), 
	p_ordertype CHAR(4)    
    )
BEGIN
DECLARE strSQL VARCHAR(65535);
	DECLARE whereSQL VARCHAR(100);
	
	SET whereSQL = '';
	
	
    	IF p_campobusqueda IS NULL THEN SET p_campobusqueda = ''; END IF;
	IF p_valorbusqueda IS NULL THEN SET p_valorbusqueda = ''; END IF;
	SET strSQL = CONCAT('SELECT * FROM 
				(  SELECT v.*, concat(c.nombre,'' '',c.appaterno,'' '',c.apmaterno) ClienteNombre
					FROM ventas v 
					inner join clientes c on v.cliente = c.clave
					',
                                whereSQL,' ) a ');
				
	IF(p_campobusqueda <> '') THEN
		SET strSQL = CONCAT(strSQL, ' WHERE ', p_campobusqueda, ' LIKE ''', p_valorbusqueda, '%''');
	END IF;
	
	CALL sp_obtienedatosporseccion2(strSQL, p_numeropagina, p_porpagina, p_orderby, p_ordertype) ;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_Venta_crear` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_Venta_crear` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Venta_crear`(
	p_cliente int,
	p_Folio  VARCHAR(6),
	p_enganche  DECIMAL(12,2),
	p_bonificacion  DECIMAL(12,2),
	p_totalt  DECIMAL(12,2),
	p_plazo  int
	
	
    )
BEGIN
	INSERT INTO ventas(folio,cliente,plazo,enganche,TotalT,Bonificacion,fecha)
			values(p_folio,
					p_cliente,
					p_plazo,
					p_enganche,
					p_bonificacion,
					p_totalt,
					curdate());
					
					select max(clave) from ventas;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `sp_Venta_obtienefolio` */

/*!50003 DROP PROCEDURE IF EXISTS  `sp_Venta_obtienefolio` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_Venta_obtienefolio`(
	  
    )
BEGIN
			SELECT max(folio) FROM ventas tc ;
					
    END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
