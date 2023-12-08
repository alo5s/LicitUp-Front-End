import { createApp } from 'vue'
import './style.css'
import router from './router';

import App from './App.vue'

// Ruta al archivo fontawesome.js son los iconos
import { FontAwesomeIcon } from './fontawesome'; 

// package manager
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// Ruta al archivo Sweetalert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Import de Vue ApexCharts para graficar
import VueApexCharts from "vue3-apexcharts";
import ApexCharts from 'apexcharts';

// Installa Floating
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.component('VueDatePicker', VueDatePicker)
.use(router)
.use(FloatingVue)
.use(VueApexCharts)
.use(VueSweetalert2)
.mount('#app')

if ('Notification' in window) {
    Notification.requestPermission()
      .then(function (permission) {
        if (permission === 'granted') {
          console.log('Permisos de notificación concedidos.');
        }
      })
      .catch(function (error) {
        console.error('Error al solicitar permisos de notificación:', error);
      });
}
