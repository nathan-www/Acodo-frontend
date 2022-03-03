import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vClickOutside from "click-outside-vue3"

import mitt from 'mitt';
const emitter = mitt();

import { api_request } from '@/utility/ApiRequest'
import { ConvertTime } from '@/utility/ConvertTime'
import { Banner, ConfirmDialog } from '@/utility/Popups'

const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.config.globalProperties.router_push = (path) => {
  emitter.emit("router_push", path);
};

// Global methods
app.mixin({
  methods: {
    api_request: api_request,
    ConvertTime: ConvertTime,
    Banner: Banner,
    ConfirmDialog: ConfirmDialog
  }
});

app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-');
app.use(vClickOutside).use(store).use(router).mount('#app');
