import Vue from 'vue';
import Vuex from 'vuex';
import data from './modules/data';
import * as actions from './actions';
// eslint-disable-file no-prototype-builtins
// eslint-disable-file no-unused-vars
Vue.use(Vuex);

export default new Vuex.Store({
  
    actions,
    modules: {
        data
    }
});