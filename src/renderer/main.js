import Vue from 'vue'
import axios from 'axios'
import VueClipboard from 'vue-clipboard2'

// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@mdi/font/css/materialdesignicons.css'

import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'xterm/dist/xterm.js'
import 'xterm/dist/xterm.css'
import 'jquery/dist/jquery.min'

require('brace/mode/text')
require('brace/mode/yaml')
require('brace/mode/ejs')
require('brace/mode/clojure')
require('brace/mode/csharp')
require('brace/mode/golang')
require('brace/mode/haskell')
require('brace/mode/html')
require('brace/mode/java')
require('brace/mode/javascript')
require('brace/mode/json')
require('brace/mode/jsx')
require('brace/mode/jade')
require('brace/mode/kotlin')
require('brace/mode/makefile')
require('brace/mode/markdown')
require('brace/mode/pgsql')
require('brace/mode/php')
require('brace/mode/powershell')
require('brace/mode/python')
require('brace/mode/r')
require('brace/mode/sql')
require('brace/mode/scss')
require('brace/mode/sh')
require('brace/mode/sql')
require('brace/mode/swift')
require('brace/mode/typescript')
require('brace/mode/xml')
require('brace/theme/monokai')

Vue.use(VueClipboard)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Vuetify, {
  iconfont: 'mdi' // 'md' || 'mdi' || 'fa' || 'fa4'
})

global.jQuery = require('jquery')
var $ = global.jQuery
window.$ = $

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
