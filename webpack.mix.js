let mix = require('laravel-mix');
let nodeDir = 'node_modules';
let jsLibDir = 'public/js/lib';

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
// windwos 環境で必要
mix.setPublicPath("./");

mix
    .js('resources/assets/js/app.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css/app.css')
    .copy(nodeDir + '/ionicons/dist/fonts', 'public/fonts')
    .copy(nodeDir + '/font-awesome/fonts/', 'public/fonts')
    .options({
        processCssUrls: false
    });
