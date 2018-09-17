using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PruebasCatalogoC.Conexion;
using PruebasCatalogoC.Vo;

namespace PruebasCatalogoC.BS
{
    public class EstudioBS
    {
        MySqlClass Con;
        public EstudioBS()
        { 
            Con = new MySqlClass();
        }

        //public int CreateEstudio(EstudioVO vo)
        //{
        //    this.Con.EstudioCrear(vo);
        //    return vo.Id;
        //}

        //public int DeleteEstudio(EstudioVO vo)
        //{
        //    this.Con.EstudioEliminar(vo);
        //    return vo.Id;
        //}

        //public int UpdateEstudio(EstudioVO vo)
        //{
        //    this.Con.EstudioActualizar(vo);
        //    return vo.Id;
        //}

        //public List<EstudioVO> ClinetesList()
        //{
        //    return this.Con.EstudiosObtenerLista();
        //}
    }
}