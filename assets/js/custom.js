var ruta_inicial = $('#base_url').val();
console.log(ruta_inicial);
var main = {
    init_datatable: function (selector) {
        if (typeof selector === 'undefined') {
            selector = '.tabla-listado';
        }
        var tabla = $(selector).dataTable({
            pageLength: 10,
            responsive: true,
            dom: '<"html5buttons"B>lTfgitp',
            buttons: [
                { extend: 'copy', text: 'Copiar',},
                {extend: 'csv'},
                {extend: 'excel', title: 'Listado'},
                {extend: 'pdf', title: 'Listado'},

                {extend: 'print', text: 'Imprimir',
                    customize: function (win){
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');

                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
                    }
                }
            ],
            "language": {
                "lengthMenu": "Mostrar _MENU_ registros por pagina",
                "zeroRecords": "Ningún registro encontrado",
                "info": "Pagina _PAGE_ de _PAGES_",
                "infoEmpty": "No hay registros",
                "infoFiltered": "(Filtrado de un total de _MAX_ registros)",
                "sSearch": "Buscar",
                "oPaginate": {
                    "sFirst":       "Primero",
                    "sPrevious":    "Anterior",
                    "sNext":        "Siguiente",
                    "sLast":        "Último"
                }
            }
        });
        $(selector + ' .dataTables_length select').addClass('form-control');
        return tabla;
    },
    numerico: function () {
        $(".numerico").numeric();
    },
    ajax: function (options) {
        $(".loading").show();
        var config = {
            ruta: '',
            data: [],
            dataType: 'json',
            type: 'POST',
            async: true,
            processData: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            fnDone: function (res) {
            },
            fnError: function (e) {
                console.log(e);
            }
        };
        $.extend(config, options);
        $.ajax({
            url: ruta_inicial + config.ruta,
            dataType: config.dataType,
            data: config.data,
            type: config.type,
            async: config.async,
            processData: config.processData,
            contentType: config.contentType
        }).done(function (res) {
            config.fnDone(res);
            $(".loading").hide();
        }).error(function (e) {
            config.fnError();
            $(".loading").hide();
        });
    },
    muestra_procesando: function () {
        $(".loading").show();
    },
    oculta_procesando: function () {
        $(".loading").hide();
    },
    base64_decode: function (data) {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            dec = '',
            tmp_arr = [];

        if (!data) {
            return data;
        }

        data += '';

        do {
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));

            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;

            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < data.length);

        dec = tmp_arr.join('');

        return dec.replace(/\0+$/, '');
    },
    base64_encode: function (data) {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];

        if (!data) {
            return data;
        }

        do {
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
        enc = tmp_arr.join('');
        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    },
    number_format: function (number, decimals, dec_point, thousands_sep) {

        number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                        .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
                .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    }
};

function validarFormulario(selector){
    sinErrores = true;
    $( 'form.' + selector + ' :input' ).each(function( index ) {
        if($("#error-" +  $( this ).prop('name')).length == 0) {

        }
        msj = validarElemento( $( this ) );
        if(msj != ''){
            if($("#error-" +  $( this ).prop('name')).length == 0) {
                //No se ha pintado el error, así que lo pintamos
                $( this ).after( '<span class="help-block m-b-none" id="error-' + $( this ).prop('name') + '">' + msj + '</span>' );
                $( this ).closest( "div" ).closest( "div" ).addClass("has-error");
            }
            sinErrores = false;
        }
    });
    return sinErrores;
}

function validarElemento(element){
    //Validar si es requerido y está vacío
    if($(element).hasClass('not-null') && $(element).val() == ''){
        return 'Este campo es requerido';
    }
    if( ($(element).hasClass('password') || $(element).hasClass('password-repeat')) && $(element).val().length < 6){
        return 'La contraseña debe de tener al menos 6 caracteres';
    }
    if($(element).hasClass('password-repeat') && $(element).val() != '' && $(".password").val() != $(".password-repeat").val() ){
        return 'Las contraseñas no coinciden';
    }
    return '';
}

function loadListado(ref) {
    var config = {
        dataType: 'html',
        ruta: 'index.php?/' + ref + '/listado',
        async: false,
        fnDone: function (html) {
            $("#listado").html(html);
            main.init_datatable();
        }
    };
    main.ajax(config);
}

function habilitarPagina(){
    $(".btn-editar").on('click', function () {
    	console.log("editar");
        var frm_editar = $('.editar-registro');
        var that = $(this);
        var tr = that.parents('tr:first');
        var registro = JSON.parse(tr.attr('data-registro'));
        console.log(registro);
        $('.editar-registro .no-modificable').attr('disabled', 'disabled');
        $('.editar-registro input, .editar-registro select').each(
            function(index){
                if( !$(this).hasClass('imagen') ){
                    $(this).val(registro[$(this).attr('name')]).change();
                    if( $(this).hasClass('chosen-select') ){
                        $(this).trigger("chosen:updated");
                    }
                }
            }
        );

        $(document).ready(function() {
                $('.summernote').summernote({
                  toolbar:[
                        ['style', ['bold', 'italic', 'underline']],
                        ['para', ['ul', 'ol','paragraph']]
                      ],
                    height: 400
                });
                if(registro['texto']){
                    $('.summernote').summernote('code',registro['texto']);
                }else{
                    $('.summernote').summernote('code',registro['valor']);
                }
                
              });

        $(".nav-tabs li:nth-child(3)").show();
        $( 'a[href="#tab-editar"]' ).tab('show');
    });

        $(".btn-editar-invitados").on('click',function(){
        var ref ='Eventos' ;
        var data = new FormData();
        var frm_editar = $('.editar-registro');
        var that = $(this);
        var tr = that.parents('tr:first');
        var idevento = tr.attr('data-id');
        var nombreevento = tr.attr('data-evento');
        
        data.append('evento', idevento);
        console.log(nombreevento);
        console.log(idevento);
        $('.editar-registro .no-modificable').attr('disabled', 'disabled');
        $('.editar-registro input, .editar-registro select').each(
            function(index){
                if( !$(this).hasClass('imagen') ){
                    $(this).val(registro[$(this).attr('name')]).change();
                    if( $(this).hasClass('chosen-select') ){
                        $(this).trigger("chosen:updated");
                    }
                }
            }
        );

        $(".nav-tabs li:nth-child(3)").show();
        $( 'a[href="#tab-editar"]' ).tab('show');

        var config = {
                dataType: 'html',
                ruta: 'index.php?/' + ref + '/getinv',
                processData: false,
                contentType: false,
                data: data,
                type: 'POST',
                fnDone: function (response) {
                    objResponse = JSON.parse(response);
                    console.log(objResponse);
                    var htmlSelect = '<div class="row">';

                    htmlSelect += '<h2><label class="control-label">Invitados al evento:'+ nombreevento +'</label></h2>';
                                
                    htmlSelect += '</div><div class="row"><div class="col-md-6"><ul>';

                    $.each( objResponse['invitados'], function( index, value ) {
                        htmlSelect += '<li class="todo-list m-t ui-sortable">'+ value.nombre +'</li>';
                    });
                                          
                    htmlSelect += '</ul></div></div><div class="hr-line-dashed"></div>';

                    $('#forminvitados').html(htmlSelect);
                }
            };
            main.ajax(config);
    });

    $(".btn-editar-psw").on('click', function () {
        var frm_editar = $('.editar-registro-psw');
        var that = $(this);
        var tr = that.parents('tr:first');
        var registro = JSON.parse(tr.attr('data-registro'));
        for(var campo in registro) {
            frm_editar.find('[name=' + campo + ']').val(registro[campo]);
        }
        $(".nav-tabs li:nth-child(5)").show();
        $( 'a[href="#tab-editar-psw"]' ).tab('show');
    });

    $(".btn-ver").on('click', function () {
        var frm_ver = $('.ver-registro');
        var that = $(this);
        var tr = that.parents('tr:first');
        var registro = JSON.parse(tr.attr('data-registro'));

        $('.ver-registro input, .ver-registro select').each(
            function(index){
                $(this).val(registro[$(this).attr('name')]).change();
                $(this).attr('disabled','disabled');
                if( $(this).hasClass('chosen-select') ){
                    $(this).trigger("chosen:updated");
                }
            }
        );


        if(registro['seguimientos']){
            var seguimientos=registro['seguimientos'];

        $('#vertical-timeline').remove();
        var seguimiento = $('#lineaseguimiento');
           seguimiento.append(
                $('<div id="vertical-timeline" class="vertical-container dark-timeline center-orientation"></div>'),
              );
              var seguimientobloques = $('#vertical-timeline');    
           $.each(seguimientos, function(index){
                var arreglofecha = this['fecha'].split(" ");
                seguimientobloques.append(
                   $('<div class="vertical-timeline-block"><div class="vertical-timeline-icon '+this['color']+'"><i class="fa '+this['icono']+'"></i></div> <div class="vertical-timeline-content"><h2>'+this['nombre']+'</h2><p>'+this['descripcion']+'</p><span class="vertical-date">'+arreglofecha[0]+'<br><small>'+arreglofecha[1]+'</small></span></div></div>'),
                );
            });
        }

        $(".nav-tabs li:nth-child(4)").show();
        $( 'a[href="#tab-ver"]' ).tab('show');
    });

    $(".btn-verseg").on('click', function () {
        var frm_ver = $('.ver-registro');
        var that = $(this);
        var tr = that.parents('tr:first');
        var registro = JSON.parse(tr.attr('data-registro'));

        $('.ver-registro input').each(
            function(index){
                $(this).val(registro[$(this).attr('name')]).change();
                $(this).attr('disabled','disabled');
                if( $(this).hasClass('chosen-select') ){
                    $(this).trigger("chosen:updated");
                }
            }
        );

        $(".nav-tabs li:nth-child(4)").show();
        $( 'a[href="#tab-ver"]' ).tab('show');
    });

    $('.btn-desactivar').on('click', function() {
        var ref = $(this).data('ref');
        var id = $(this).data('id');

        var data = new FormData();
        data.append('id', id);
        data.append('estatus', 'BA');

        var config = {
            dataType: 'html',
            ruta: 'index.php?/' + ref + '/editar',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST',
            fnDone: function (response) {
                if(response == 'OK') {
                    toastr.success('El registro ha sido desactivado correctamente', 'Éxito');
                    loadListado(ref);
                    habilitarPagina();
                } else {
                    toastr.error(response, 'Error');
                }
            }
        };
        main.ajax(config);
    });

    $('.btn-reactivar').on('click', function() {
        var ref = $(this).data('ref');
        var id = $(this).data('id');

        var data = new FormData();
        data.append('id', id);
        data.append('estatus', 'AC');

        var config = {
            dataType: 'html',
            ruta: 'index.php?/' + ref + '/editar',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST',
            fnDone: function (response) {
                if(response == 'OK') {
                    toastr.success('El registro ha sido reactivado correctamente', 'Éxito');
                    loadListado(ref);
                    habilitarPagina();
                } else {
                    toastr.error(response, 'Error');
                }
            }
        };
        main.ajax(config);
    });

}

$(document).ready(function(){
    $(".nav-tabs li:nth-child(3)").hide();
    $(".nav-tabs li:nth-child(4)").hide();
    $(".nav-tabs li:nth-child(5)").hide();
    habilitarPagina();



    $('input').keypress(function() {
        if($("#error-" +  $( this ).prop('name')).length > 0) {
            //Hay un mensaje de error pintado en el campo, así que lo eliminamos
            $(this).next('span').remove();
            $( this ).closest( "div" ).closest( "div" ).removeClass("has-error");
        }
    });

    $('input, select').change(function() {
        if($("#error-" +  $( this ).prop('name')).length > 0) {
            //Hay un mensaje de error pintado en el campo, así que lo eliminamos
            $(this).next('span').remove();
            $( this ).closest( "div" ).closest( "div" ).removeClass("has-error");
        }
    });

    $('#id_evento').change(function(){
        var ref ='Realizarpago' ;
        var data = new FormData();
        data.append('evento', $("#id_evento").val().trim());

        var config = {
                dataType: 'html',
                ruta: 'index.php?/' + ref + '/getinv',
                processData: false,
                contentType: false,
                data: data,
                type: 'POST',
                fnDone: function (response) {
                    objResponse = JSON.parse(response);
                    console.log(objResponse);
                    var htmlSelect = '';
                    
                   $.each( objResponse['invitados'], function( index, value ) {
                        //console.log(value.id);
                        htmlSelect += '<option value="' + value.id + '">' + value.nombre + '</option>';
                   });

                    /*objResponse.forEach(
                        console.log(element => console.log(element))
                        //htmlSelect += '<option value="' + value.id + '">' + value.nombre + '</option>';
                    );*/

                    $('#id_invitado').html(htmlSelect);
                }
            };
            main.ajax(config);
    });

    $('.btn-acepta-guardar').on('click', function() {
        if(validarFormulario('nuevo-registro')){
            var data = new FormData();
            var ref = $(this).data('ref');
            $("form.nuevo-registro :input").each(function(){
                if($(this).attr('name') != undefined){
                    if(!$(this).hasClass('not-field')){
                        if($(this).prop('type') == 'password'){
                            data.append($(this).attr('name'), main.base64_encode($(this).val().trim()));
                        } else {
                            if($(this).prop('multiple')){
                                data.append($(this).attr('name'), JSON.stringify($(this).val()));
                            } else {
                                data.append($(this).attr('name'), $(this).val().trim());
                            }
                        }
                    }
                }
            });

            //data.append('texto', $(".summernote").summernote('code'));

            var config = {
                dataType: 'html',
                ruta: 'index.php?/' + ref + '/guardar',
                processData: false,
                contentType: false,
                data: data,
                type: 'POST',
                fnDone: function (response) {
                    if(response == 'OK') {
                        $("form :input").val('');
                        $('.nav-tabs a:first').tab('show');
                        toastr.success('Registro guardado correctamente', 'Éxito');
                        loadListado(ref);
                        habilitarPagina();
                    } else {
                        toastr.error(response, 'Error');
                    }
                }
            };
            main.ajax(config);
        }
    });


    $('.btn-acepta-guardar-imagen').on('click', function() {
        if(validarFormulario('nuevo-registro')){
            var data = new FormData();
            var ref = $(this).data('ref');
            $("form.nuevo-registro :input").each(function(){
                if($(this).attr('name') != undefined){
                    if(!$(this).hasClass('not-field')){
                        if($(this).prop('type') == 'password'){
                            data.append($(this).attr('name'), main.base64_encode($(this).val().trim()));
                        } else {
                            if($(this).prop('multiple')){
                                data.append($(this).attr('name'), JSON.stringify($(this).val()));
                            } else {
                                data.append($(this).attr('name'), $(this).val().trim());
                            }
                        }
                    }
                }
            });

            data.append('imagen', $("#image-upload").get(0).files[0]);

            var config = {
                dataType: 'html',
                ruta: 'index.php?/' + ref + '/guardar_imagen',
                processData: false,
                contentType: false,
                data: data,
                type: 'POST',
                fnDone: function (response) {
                    if(response == 'OK') {
                        $("form :input").val('');
                        $('.nav-tabs a:first').tab('show');
                        toastr.success('Registro guardado correctamente', 'Éxito');
                        loadListado(ref);
                        habilitarPagina();
                    } else {
                        toastr.error(response, 'Error');
                    }
                }
            };
            main.ajax(config);
        }
    });

    $('.btn-acepta-editar').on('click', function() {
        if(validarFormulario('editar-registro')){
            var data = new FormData();
            var ref = $(this).data('ref');
            $("form.editar-registro :input").each(function(){
                if($(this).attr('name') != undefined){
                    if(!$(this).hasClass('not-field')){
                        if($(this).prop('type') == 'password'){
                            data.append($(this).attr('name'), main.base64_encode($(this).val().trim()));
                        } else {
                            if($(this).prop('multiple')){
                                data.append($(this).attr('name'), JSON.stringify($(this).val()));
                            } else {
                                data.append($(this).attr('name'), $(this).val().trim());
                            }
                        }
                    }
                }
            });

            data.append('texto', $(".summernote").summernote('code'));

            var config = {
                dataType: 'html',
                ruta: 'index.php?/' + ref + '/editar',
                processData: false,
                contentType: false,
                data: data,
                type: 'POST',
                fnDone: function (response) {
                    if(response == 'OK') {
                        $("form :input").val('');
                        $('.nav-tabs a:first').tab('show');
                        toastr.success('Registro editado correctamente', 'Éxito');
                        $(".nav-tabs li:nth-child(3)").hide();
                        $( 'a[href="#tab-editar]' ).tab('hide');
                        loadListado(ref);
                        habilitarPagina();
                    } else {
                        toastr.error(response, 'Error');
                    }
                }
            };
            main.ajax(config);
        }
    });

    $('.btn-acepta-editar-imagen').on('click', function() {
        if(validarFormulario('editar-registro')){
            var data = new FormData();
            var ref = $(this).data('ref');
            $("form.editar-registro :input").each(function(){
                if($(this).attr('name') != undefined){
                    if(!$(this).hasClass('not-field')){
                        if($(this).prop('type') == 'password'){
                            data.append($(this).attr('name'), main.base64_encode($(this).val().trim()));
                        } else {
                            if($(this).prop('multiple')){
                                data.append($(this).attr('name'), JSON.stringify($(this).val()));
                            } else {
                                data.append($(this).attr('name'), $(this).val().trim());
                            }
                        }
                    }
                }
            });

            data.append('imagen', $("#image-upload-e").get(0).files[0]);
            var config = {
                dataType: 'html',
                ruta: 'index.php?/' + ref + '/editar_imagen',
                processData: false,
                contentType: false,
                data: data,
                type: 'POST',
                fnDone: function (response) {
                    console.log(data);
                    if(response == 'OK') {
                        $("form :input").val('');
                        $('.nav-tabs a:first').tab('show');
                        toastr.success('Registro editado correctamente', 'Éxito');
                        $(".nav-tabs li:nth-child(3)").hide();
                        $( 'a[href="#tab-editar]' ).tab('hide');
                        loadListado(ref);
                        habilitarPagina();
                    } else {
                        toastr.error(response, 'Error');
                    }
                }
            };
            main.ajax(config);
        }
    });


    $('.btn-cancelar').on('click', function() {
        $(this).closest('form').trigger("reset");
        $('.nav-tabs a:first').tab('show');
        var child = $(this).data('child');
        if(child > 0){
            $(".nav-tabs li:nth-child(" + child + ")").hide();
        }
    });


    main.init_datatable();

    $.fn.datepicker.dates['es'] = {
        format: "yyyy-mm-dd",
        months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
        monthsShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"],
        daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
        daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        today: "Hoy",
        clear: "Limpiar",
        format: "yyyy-mm-dd",
        titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
        weekStart: 0
    };

    $('.date').datepicker({
        startView: 0,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        language: 'es'

    });

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    });

    $('.chosen-select').chosen({width: "100%"});


/// DIRECCIONES ///

    $('.pais').change(function () {
        var pais = $(this).val();
        var destino = $(this).data('destino');
        var data = new FormData();
        data.append('pais', pais);

        var config = {
            dataType: 'html',
            ruta: 'estados/obtenerPorPais',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST',
            async: false,
            fnDone: function (response) {
                objResponse = JSON.parse(response);
                var htmlSelect = '<option value="">Seleccione uno</option>';
                $.each( objResponse, function( index, value ) {
                    htmlSelect += '<option value="' + value.id + '">' + value.nombre + '</option>';
                });
                $('#' + destino).html(htmlSelect);
                if( $('#' + destino).hasClass('chosen-select') ){
                    $('#' + destino).trigger("chosen:updated");
                }
            }
        };
        main.ajax(config);
    });

    $('.estado').change(function () {
        var estado = $(this).val();
        var destino = $(this).data('destino');
        var data = new FormData();
        data.append('estado', estado);

        var config = {
            dataType: 'html',
            ruta: 'ciudades/obtenerPorEstado',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST',
            async: false,
            fnDone: function (response) {
                objResponse = JSON.parse(response);
                var htmlSelect = '<option value="">Seleccione una</option>';
                $.each( objResponse, function( index, value ) {
                    htmlSelect += '<option value="' + value.id + '">' + value.nombre + '</option>';
                });
                $('#' + destino).html(htmlSelect);
                if( $('#' + destino).hasClass('chosen-select') ){
                    $('#' + destino).trigger("chosen:updated");
                }
            }
        };
        main.ajax(config);
    });

    $('.ciudad').change(function () {
        var ciudad = $(this).val();
        var destino = $(this).data('destino');
        var data = new FormData();
        data.append('ciudad', ciudad);

        var config = {
            dataType: 'html',
            ruta: 'colonias/obtenerPorCiudad',
            processData: false,
            contentType: false,
            data: data,
            type: 'POST',
            async: false,
            fnDone: function (response) {
                objResponse = JSON.parse(response);
                var htmlSelect = '<option value="">Seleccione una</option>';
                $.each( objResponse, function( index, value ) {
                    htmlSelect += '<option value="' + value.id + '" data-cp="' + value.cp + '">' + value.nombre + '</option>';
                });
                $('#' + destino).html(htmlSelect);
                if( $('#' + destino).hasClass('chosen-select') ){
                    $('#' + destino).trigger("chosen:updated");
                }
            }
        };
        main.ajax(config);
    });


    $(document).on("click", ".add-relaciones", function() {
        //i = $(this).closest('td').parent()[0].sectionRowIndex;
        //$('#' + $(this).data('tabla-destino') + ' tr:eq(' + (i + 1) + ')').remove();

        var form = $(this).parents('form:first');
        console.log(form.attr('class'));
        $('#' + $(this).data('modal-captura') + '.btn-acepta-modal-relacion').data('tabla-destino', $(this).data('tabla-destino'));
        $('#' + $(this).data('modal-captura') + '.btn-acepta-modal-relacion').data('form-destino', form.name);

        $('#tabla-destino').val( $(this).data('tabla-destino') );


        $('#' + $(this).data('modal-captura') + ' input').val('');
        $('#' + $(this).data('modal-captura') + ' select').val('');
        $('#' + $(this).data('modal-captura') + ' select').trigger("chosen:updated");


        $('#id_tipo_contacto').val('');
        $('#id_tipo_contacto').trigger("chosen:updated");
        $('#nombre_contacto').val('');
        $('#valor').val('');
        $('#' + $(this).data('modal-captura') ).modal('show');


    });


}); //$(document).ready(function()