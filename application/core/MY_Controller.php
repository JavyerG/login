<?php
defined('BASEPATH') OR exit('No direct script access allowed');

date_default_timezone_set('America/Mexico_City');

class MY_Controller extends CI_Controller {

	protected $_data = array();

	public function __construct(){
		parent::__construct();
		$this->_iniciarlizar();
	}

	private function _iniciarlizar() {
		if($this->_data['validar_login'] == true && $this->session->userdata('logueado') != true){
			redirect(base_url('index.php?/usuario/login'));
		}

		$this->_data['estatus'] = array(
				'AC' => array('etiqueta' => 'label-primary', 'texto' => 'Activo'),
				'BA' => array('etiqueta' => 'label-danger', 'texto' => 'Inactivo'),
			);

        $puedeModificar = true;
		if(isset($this->_data['permiso_modificar'])){
            $puedeModificar = in_array($this->_data['permiso_modificar'], $this->session->userdata('permisos'));
        }
        $this->_data['puedeModificar'] = $puedeModificar ? 1 : 0;
		$this->load->vars($this->_data);
	}

    private function _totalDiasMes($mes=false,$ano=false){
        $salida = false;
        if((isset($mes) && !empty($mes)) && (isset($ano) && !empty($ano))){
            $salida = cal_days_in_month(CAL_GREGORIAN, $mes, $ano);
        }
        return $salida;
    }

    public function _baseDiasMes($mes = false,$ano=false){
        $salida = false;

        if($mes && $ano){
            $dias = $this->_totalDiasMes($mes,$ano);
            if(is_numeric($dias) && $dias >= 28){
                for($a=1;$a<=$dias;$a++){
                    $diasArray[$a] = 0;
                }
                $salida = $diasArray;
            }
        }
        return $salida;
    }

    public function _baseMesAno($nombre = false){
        if($nombre){
            $salida = array("1"=>"Enero","2"=>"Febrero","3"=>"Marzo","4"=>"Abril","5"=>"Mayo","6"=>"Junio","7"=>"Julio","8"=>"Agosto","9"=>"Septiembre","10"=>"Obtubre","11"=>"Noviembre","12"=>"Diciembre");
        }else{
            for($a = 1; $a<=12; $a++){
                $salida[$a] = 0;
            }
        }

        return $salida;

    }

	public function presentar() {
		$this->load->vars($this->_data);
		$this->load->view('base');
	}

    public function dashboard() {
        
        $this->_data['contenido'][] = $this->load->view($this->_data['vista'],$this->data, true);
        $this->presentar();
    }

    public function listar($datosAdicionales = null) {
        if($datosAdicionales != null){
            $this->data = array_merge($this->data, $datosAdicionales);
        }
        $this->data['registros'] = $this->Main_model->get_all();
        $this->data['listado'] = $this->load->view($this->_data['vista_tabla'],$this->data, true);
        $this->_data['contenido'][] = $this->load->view($this->_data['vista'],$this->data, true);
        $this->presentar();
    }

    public function guardar() {
        try {
            if ($this->input->post()) {
                $datos = $this->input->post();
                error_log('Guardando ' . $this->_data['registro'] . json_encode($datos));
                $this->Main_model->nuevo($datos);
                echo 'OK';
            }
        } catch(Exception $e){
            error_log(print_r(debug_backtrace(), TRUE));
            echo 'Error al insertar el registro. ' . $e->getMessage();
        }
    }

    public function editar() {
        try {
            if ($this->input->post()) {
                $datos = $this->input->post();
                $id = $datos['id'];
                unset($datos['id']);
                error_log('Editando ' . $this->_data['registro']  . json_encode($datos));
                $this->Main_model->actualizar($datos, $id);
                echo 'OK';
            }
        } catch(Exception $e){
            error_log(print_r(debug_backtrace(), TRUE));
            echo 'Error al actualizar el registro. ' . $e->getMessage();
        }
    }

    public function listado() {
        $this->data['registros'] = $this->Main_model->get_all();
        $this->data['listado'] = $this->load->view($this->_data['vista_tabla'],$this->data, true);
        echo $this->data['listado'];
    }

    public static function tienePermiso($permisos){
	    $tiene = false;
	    $todosPermisos = $_SESSION['permisos'];
	    foreach($permisos as $permiso){
	        if(in_array($permiso, $todosPermisos)){
	            $tiene = true;
            }
        }
        return $tiene;
    }

    public function todosLosPermisos(){
        $permisos =
        [
            'SISTEMA_CONFIGURACION_MODIFICAR',
            'SISTEMA_CONFIGURACION_CONSULTAR',
            'SEGURIDAD_USUARIOS_MODIFICAR',
            'SEGURIDAD_USUARIOS_CONSULTAR',
            'SEGURIDAD_GRUPOS_MODIFICAR',
            'SEGURIDAD_GRUPOS_CONSULTAR',
            'SEGURIDAD_USUARIOS_X_GRUPO_MODIFICAR',
            'SEGURIDAD_USUARIOS_X_GRUPO_CONSULTAR',
            'SEGURIDAD_PERMISOS_MODIFICAR',
            'SEGURIDAD_PERMISOS_CONSULTAR',
            'OPERACIONES_PROMOCIONES_MODIFICAR',
            'OPERACIONES_PROMOCIONES_CONSULTAR',
            'OPERACIONES_REGIONES_MODIFICAR',
            'OPERACIONES_REGIONES_CONSULTAR',
            'BEACON_PERMISOS_MODIFICAR',
            'BEACON_PERMISOS_CONSULTAR',
            'OPERACIONES_BEACONS_X_REGION_MODIFICAR',
            'OPERACIONES_BEACONS_X_REGION_CONSULTAR',
            'OPERACIONES_PROMOCIONES_X_REGION_MODIFICAR',
            'OPERACIONES_PROMOCIONES_X_REGION_CONSULTAR'

        ];
        return $permisos;
    }
}
