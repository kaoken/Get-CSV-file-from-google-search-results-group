window.Vue = require('vue');
/**
 * Validation
 */
require('./validation');


Vue.use(require('vue-router'));

//Vue.use(require('vue-countup'));

//import VueSticky from 'vue-sticky' // Es6 module
//Vue.use(VueSticky);


/**
 * Bootstrap Vue
 */
Vue.use(require('bootstrap-vue'));


/**
 * Vue Toastr
 */
import VueToastr from '@deveodk/vue-toastr';
Vue.use(VueToastr, {
    defaultPosition: 'toast-top-right',
});

Vue.use(require('vue-moment'));

import Vue2Filters from 'vue2-filters';
Vue.use(Vue2Filters);