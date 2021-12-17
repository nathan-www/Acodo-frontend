import {
  createApp
} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vClickOutside from "click-outside-vue3"

const app = createApp(App);

// Global methods
app.mixin({
  methods: {
    api_request: async function(method, endpoint, json, delay = 0) {

      let api_url = "http://localhost:8888";

      if (method == "POST") {
        var resp = await fetch(api_url + endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(json)
        });
      } else {
        var resp = await fetch(api_url + endpoint);
      }

      if (delay > 0) {
        await (new Promise(function(resolve, reject) {
          setInterval(() => {
            resolve();
          }, delay)
        }));
      }

      return await resp.json();

    }
  }
});

app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ion-');
app.use(vClickOutside).use(store).use(router).mount('#app');
