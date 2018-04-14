// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import strm from './strm'
import Vuex from 'vuex'
import XHR from './xhr'

Vue.use(Vuex)

Vue.config.productionTip = false

var store = new Vuex.Store({
  state: {
    rules: [],
    files: []
  },
  getters: {
    getRules: state => {
      return state.rules;
    }
  },
  mutations: {
    setRuleAndFile (state, {rules, files}) {
      state.rules = rules;
      state.files = files;
      strm.BuildRules(state.rules, state.files);
    },
  }
});


store.watch((state) => state.rules, (oldValue, newValue) => {
  strm.BuildRules(store.state.rules, store.state.files);
}, {
  deep: true
})

store.watch((state) => state.files, (oldValue, newValue) => {
  strm.BuildRules(store.state.rules, store.state.files);
}, {
  deep: true
})


XHR.GET('//'+location.hostname+':3000/config', (config) => {
  for (var i = 0; i < config.rules.length; i++) {
    config.rules[i].env = config.rules[i].env || "all";
  }
  store.commit('setRuleAndFile', config);
  new Vue({
    el: '#app',
    store,
    components: { App },
    template: '<App/>'
  })
})


Vue.prototype.ENVS = ['P-all', 'P-sum', 'IP-all', 'IP-sum'];
Vue.prototype.RULES = strm.RULES;


