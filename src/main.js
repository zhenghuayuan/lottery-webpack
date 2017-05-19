import Vue from 'vue'
import axios from 'axios';
import Vonic from 'vonic/src/index.js'
import './assets/common/flexible'
import 'fastclick'

// Page Components
import Index from './components/pages/Index.vue'
import detail from './components/pages/detail.vue'
//import about from './components/About.vue'

Vue.prototype.$http = axios;

// Routes
const routes = [
  { path: '/index', component: Index },
  { path: '/detail', component: detail },
  { path: '/', redirect: '/index' }
]
/*

function errorHandler(e){
  var error = 'error: '+ e.message+'\n file: '+ e.filename+'\n line: '+ e.lineno;
  window.alert(error);
}
window.addEventListener("error", errorHandler, false);
*/

Vue.use(Vonic.app, {
  routes: routes
});
