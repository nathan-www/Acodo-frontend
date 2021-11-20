import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vClickOutside from "click-outside-vue3"

const app = createApp(App);
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-');
app.use(vClickOutside).use(store).use(router).mount('#app');
