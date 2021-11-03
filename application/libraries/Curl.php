<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Curl {

    protected static $API_ROOT_URL = "";
    
    /**
     * Configuration for CURL
     */
    public static $CURL_OPTS = array(
        CURLOPT_USERAGENT => "SC-PHP-SDK-0.0.1", 
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_CONNECTTIMEOUT => 10, 
        CURLOPT_RETURNTRANSFER => 1, 
        CURLOPT_TIMEOUT => 60
    );

    /**
     * Constructor method.
     */
    public function __construct() {
    }

    /**
     * Execute a GET Request
     * @param string $path
     * @param array $params
     * @param array $headers
     * @return mixed
     */
    public function get($path, $params = array(), $headers = array()) {
        $opts = array(
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CUSTOMREQUEST => "GET"
        );
        $exec = $this->execute($path, $opts, $params);

        return $exec;
    }

    /**
     * Execute a POST Request
     * @param string $path
     * @param string $body
     * @param array $params
     * @param array $headers
     * @return mixed
     */
    public function post($path, $body = null, $params = array(), $headers = array()) {
        $opts = array(
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POST => true, 
            CURLOPT_POSTFIELDS => $body
        );

        $exec = $this->execute($path, $opts, $params);

        return $exec;
    }

    /**
     * Execute a PUT Request
     * @param string $path
     * @param string $body
     * @param array $params
     * @param array $headers
     * @return mixed
     */
    public function put($path, $body = null, $params = array(), $headers = array()) {
        $opts = array(
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_POSTFIELDS => $body
        );
        
        $exec = $this->execute($path, $opts, $params);

        return $exec;
    }

    /**
     * Execute a DELETE Request
     * 
     * @param string $path
     * @param array $params
     * @return mixed
     */
    public function delete($path, $params) {
        $opts = array(
            CURLOPT_CUSTOMREQUEST => "DELETE"
        );
        
        $exec = $this->execute($path, $opts, $params);
        
        return $exec;
    }

    /**
     * Execute a OPTION Request
     * 
     * @param string $path
     * @param array $params
     * @return mixed
     */
    public function options($path, $params = null) {
        $opts = array(
            CURLOPT_CUSTOMREQUEST => "OPTIONS"
        );
        
        $exec = $this->execute($path, $opts, $params);

        return $exec;
    }

    /**
     * Execute all requests and returns the json body and headers
     * 
     * @param string $path
     * @param array $opts
     * @param array $params
     * @param boolean $assoc
     * @return mixed
     */
    public function execute($path, $opts = array(), $params = array(), $assoc = false) {
        //$uri = $this->make_path($path, $params);    
        
        $ch = curl_init($path);
        curl_setopt_array($ch, self::$CURL_OPTS);

        if(!empty($opts))
            curl_setopt_array($ch, $opts);

        $return["body"] = json_decode(curl_exec($ch), $assoc);
        $return["httpCode"] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        return $return;
    }

    /**
     * Check and construct an real URL to make request
     * 
     * @param string $path
     * @param array $params
     * @return string
     */
    public function make_path($path, $params = array()) {
        if (!preg_match("/^\//", $path)) {
            $path = '/' . $path;
        }

        $uri = self::$API_ROOT_URL . $path;
        
        if(!empty($params)) {
            $paramsJoined = array();

            foreach($params as $param => $value) {
               $paramsJoined[] = "$param=$value";
            }
            $params = '?'.implode('&', $paramsJoined);
            $uri = $uri.$params;
        }

        return $uri;
    }
}