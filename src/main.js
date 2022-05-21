import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router';
import routes  from './routes';
// import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { BootstrapVue } from 'bootstrap-vue'
// import { Bootstrap } from 'bootstrap'
import store from './store/store'

// import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Vuetify from 'vuetify'
import vDataTable from 'v-data-table'
import 'vuetify/dist/vuetify.min.css'

import '@mdi/font/css/materialdesignicons.css'

// eslint-disable-file no-prototype-builtins
// eslint-disable-file no-unused-vars

Vue.use(BootstrapVue);
Vue.use(Vuetify)
 Vue.use(vDataTable);
Vue.use(VueRouter);
Vue.config.productionTip = false

async function initApp() {
  const router = new VueRouter({
    routes
  });


  new Vue({
    router,
    store,
    vuetify: new Vuetify(),
    render: h => h(App),
  }).$mount('#app')
}   

try{
  initApp()
} catch(ex) {
  document.getElementById('app').innerText = ex.message;
}


