import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from '@vuelidate/core';
import VueCookies from "vue-cookies"

const app = createApp(App)

app.use(Vuelidate)
app.use(VueCookies)


app.use(router).mount('#app')