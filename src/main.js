import Vue from 'vue'
//import ElementUI from 'element-ui'
import {DatePicker} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'

import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = {size: 'small', zIndex: 3000};
Vue.use(DatePicker)
//Vue.use(ElementUI)

new Vue({
    render: h => h(App),
}).$mount('#app')
