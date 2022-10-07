import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from '@vuelidate/core';

const app = createApp(App)

app.use(Vuelidate)


app.use(router).mount('#app')