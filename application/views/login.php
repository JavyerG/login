<!DOCTYPE html>
<html>

    <head>

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>

        <link href="<?php echo base_url('assets/css/bootstrap.min.css'); ?>" rel="stylesheet">
        <link href="<?php echo base_url('assets/font-awesome/css/font-awesome.css'); ?>" rel="stylesheet">

        <!-- Toastr style -->
        <link href="<?php echo base_url('assets/css/plugins/toastr/toastr.min.css'); ?>" rel="stylesheet">

        <link href="<?php echo base_url('assets/css/animate.css'); ?>" rel="stylesheet">
        <link href="<?php echo base_url('assets/css/style.css'); ?>" rel="stylesheet">

    </head>

    <body class="gray-bg">

        <div class="middle-box text-center loginscreen animated fadeInDown">
            <div>
                <div>
                </div>
                <h3>Welcome!</h3>
                <p>Login Page.</p>
                <form class="m-t" id="login" role="form" action="index.html">
                    <div class="form-group">
                        <input type="text" class="form-control" name="codigo" id="codigo" placeholder="Codigo">
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password">
                    </div>
                    <button type="submit" id="submitButtonHTML" class="btn btn-primary block full-width m-b">Entrar</button>
</form>
            </div>
        </div>

        <!-- Mainly scripts -->
        <script src="<?php echo base_url('assets/js/jquery-2.1.1.js'); ?>"></script>
        <script src="<?php echo base_url('assets/js/bootstrap.min.js'); ?>"></script>

        <!-- Toastr script -->
        <script src="<?php echo base_url('assets/js/plugins/toastr/toastr.min.js'); ?>"></script>

        <script type="text/javascript">

            (function($){

                http = '<?php echo base_url(); ?>';

                $(document).on('click', '#submitButtonHTML', function(e){
                    e.preventDefault();
                    var that = $('#login');
                    $.ajax({
                        url: http + 'index.php?/login/login',
                        type: "POST",
                        async: false,
                        dataType: 'json',
                        data: that.serialize()
                    }).done(function(dato){
                        if(dato.tipo == 1)
                        {
                            toastr.error(dato.mensaje,'Error');
                        }
                        else {
                            toastr.success(dato.mensaje,'Correct');

                            setTimeout(function(){
                                window.location = http + 'index.php?/login';
                            }, 1000);
                        }
                    }).error(function(){

                    });

                });

            })(jQuery)
        </script>
    </body>

</html>
