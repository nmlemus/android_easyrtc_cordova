TODO:
1. Desde la pagina de inicio se debe verificar si existe un profile registrado, si es el caso, se debe hacer la consulta a la base de datos local para obtener el numero de telefono del mismo y pasarselo al homeController en la llamada a:

$state.go("home", {phonenumber: $scope.name});



2. Incorporar el International Telephone Input dentro de la aplicacion:
        http://jackocnr.com/intl-tel-input.html
        https://github.com/Bluefieldscom/intl-tel-input
        https://github.com/mareczek/international-phone-number




TERMINADO:


Para lograr acceder al servicio desde la app local se hizo lo siguiente:

1. Adicionar 
        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            next();
        });
al fichero express.js del servidor goblob.com. (Esta modificacion está hecha en la version 1.4) El fichero express.js está en la carpeta config.

2. Adicionar un servicio a la app local. El servicio adicionado está dentro del modulo register y se llama register.service.js. El codigo que tiene dentro es el siguiente:

        'use strict';

        //Profiles service used to communicate Profiles REST endpoints
        angular.module('register').factory('Profiles', ['$resource',
                function($resource) {
                    return $resource('https://10.0.0.104:3000/profiles/:profileId', { profileId: '@_id'
                }, {
                    update: {
                        method: 'PUT'
                    }
                });
            }
        ]);

3. Se testo la funcionalidad del servicio listando todos los profiles almacenados en la base de datos.

// Find a list of Profiles
        $scope.find = function() {
            $scope.profiles = Profiles.query();
        };


4. Adicionar directiva de seguridad que permite definir dominios de acceso:
     una directiva de seguridad que tiene cordova que dice <access origin="*"/> que se supone que garantice que uno pueda acceder a cualquier sitio desde la app de android, pues no es suficiente. Asi que hay que instalar un plugin que se llama whitelist y despues añadir esta otra directiva
        <allow-navigation href="https://10.0.0.104:3000/*" />

        
	
http://stackoverflow.com/questions/30729187/rest-service-from-cordova-with-wamp-local
I had quiet the same issue.

I do agree with @Keval, you probably doesn't have the permission to access to the internet.

Add this plugin https://github.com/apache/cordova-plugin-whitelist and go to your config.xml file. In this one, just att this line, with your IP adress of course :

<allow-navigation href="http://xxx.xxx.xxx.xxx/*" />

This may solve it, because the <access origin="*" /> isn't enough. (At least, wasn't enough for me)



PARA QUE AL COMPILAR SE COPIEN TODOS LOS JS DE LA CARPETA app/js HACIA LA APP DE ANDROID SE MODIFICO EN EL FICHERO Gruntfile.js ESTA PARTE:

// Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'index.html',
                        'js/easyrtc.js',
                        'js/socket.io.js',
                        'js/utils.js',
                        'modules/*/views/*.html',
                        'img/{,*/}*.{webp}',
                        'fonts/*'
                    ]

AGREGANDO EN src 'js/*'. SOLO SERIA NECESARIO EL SOCKET Y EL EASYRTC DE MOMENTO, ASI QUE SE PUEDEN PONER SOLO ESOS DOS.