import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import PerfView from './views/PerfView.vue'
import router from './router'

const app = createApp(PerfView)

app.use(createPinia())
app.use(router)

app.mount('#app')
