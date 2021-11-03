<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

	public function __construct(){
		parent::__construct();

		//$this->load->model('Login_model');
		$submitButtonHTML = '<input type="submit" value="Log In"/>';
		$loginHeaderText = 'Log In';
		$isAdminLogin = false;
		$totalSiteLogins = 0;

	}

	public function index() {

		if($this->session->userdata('isAdminLogin') != true){
			$this->loginscreen();
		}else{
            redirect(base_url('index.php?/dashboard'));
		}
	}

	public function loginscreen() {
		$submitButtonHTML = 
		$this->load->view('login');
	}

	public function login(){
	echo true;
	}
}
