<?php

date_default_timezone_set('America/Mexico_City');

class MY_Model extends CI_Model {

	protected $_tabla = '';

	public function __construct(){
		parent::__construct();
	}

	public function nuevo($datos) {
        $campos = $this->db->list_fields($this->_tabla);
        $registro = array();
        foreach ($campos as $campo){
            if(isset($datos[$campo])){
                $registro += array($campo => $datos[$campo]);
            }
        }
        if (in_array('estatus', $campos) && !isset($datos['estatus'])){
            $registro += array('estatus' => 'AC');
        }
        if (in_array('usuario_alta', $campos) && isset($_SESSION['usuario'])){
            $registro += array('usuario_alta' => $_SESSION['usuario']);
        }
        if (in_array('fecha_alta', $campos)){
            date_default_timezone_set('America/Mexico_City');
            $registro += array('fecha_alta' => date('Y/m/d h:i:s a', time()));
        }
        error_log(json_encode($registro));
		$this->db->insert($this->_tabla, $registro);
		return $this->db->insert_id();
	}

    public function insert($datos, $tabla) {
        $campos = $this->db->list_fields($tabla);
        $registro = array();
        foreach ($campos as $campo){
            if(isset($datos[$campo])){
                $registro += array($campo => $datos[$campo]);
            }
        }
        if (in_array('estatus', $campos) && !isset($datos['estatus'])){
            $registro += array('estatus' => 'AC');
        }
        if (in_array('usuario_alta', $campos) && isset($_SESSION['usuario'])){
            $registro += array('usuario_alta' => $_SESSION['usuario']);
        }
        if (in_array('fecha_alta', $campos)){
            date_default_timezone_set('America/Mexico_City');
            $registro += array('fecha_alta' => date('Y/m/d h:i:s a', time()));
        }

        $this->db->insert($tabla, $registro);
        //return $this->db->insert_id();
    }

	public function actualizar($datos, $id) {
        $campos = $this->db->list_fields($this->_tabla);
        $registro = array();
        foreach ($campos as $campo){
            if(isset($datos[$campo])){
                $registro += array($campo => $datos[$campo]);
            }
        }
        if (in_array('usuario_modificacion', $campos) && isset($_SESSION['usuario'])){
            $registro += array('usuario_modificacion' => $_SESSION['usuario']);
        }
        if (in_array('fecha_modificacion', $campos)){
            date_default_timezone_set('America/Mexico_City');
            $registro += array('fecha_modificacion' => date('Y/m/d h:i:s a', time()));
        }
		return $this->db->where('id', $id)->update($this->_tabla, $registro);
	}

	public function get_all(){
		return $this->db->from($this->_tabla)
			->get()
			->result();
	}

	public function get_by_id($id){
		return $this->db->from($this->_tabla)
			->where('id', $id)
			->get()
			->row();
	}

    public function get_activos(){
        return $this->db->from($this->_tabla)
            ->where('estatus', 'AC')
            ->get()
            ->result();
    }

    public function eliminar($filtros){
        $this->db->delete($this->_tabla, $filtros);
    }

    public function delete($tabla, $filtros){
        $this->db->delete($tabla, $filtros);
    }
}