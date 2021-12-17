import {
  createStore
} from 'vuex'

async function api_request(method, endpoint, json) {

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

  return await resp.json();

}

//to handle state
const state = {

  account: null,
  isLoggedIn: null

}

//to handle state
const getters = {
  getAccount: (state) => {
    return state.account;
  }
}

//to handle actions
const actions = {

  getAccount({ commit }) {
    api_request('GET','/account/details').then((resp) => {
      commit("SET_ACCOUNT",resp);
    });
  }

}

//to handle mutations
const mutations = {

  SET_ACCOUNT(state,account){
    if(account.status == "success"){
      state.isLoggedIn = true;
      state.account = account;
    } else {
      state.isLoggedIn = false;
    }
  }

}


export default createStore({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {}
})
