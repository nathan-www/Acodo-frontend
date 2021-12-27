import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vClickOutside from "click-outside-vue3"

import { api_request } from '@/utility/ApiRequest'
import { ConvertTime } from '@/utility/ConvertTime'

const app = createApp(App);

// Global methods
app.mixin({
  methods: {
    api_request: api_request,
    ConvertTime: ConvertTime
  }
});

app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-');
app.use(vClickOutside).use(store).use(router).mount('#app');
