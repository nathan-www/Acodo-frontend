import {
  createStore
} from 'vuex'

import { api_request } from '@/utility/ApiRequest'

//to handle state
const state = {

  account: null,
  isLoggedIn: null,
  courses: {}

}

//to handle state
const getters = {
  getAccount: (state) => {
    return state.account;
  },
  getLevel: (state) => (course_slug, chapter_slug, level_slug) => {
    try{
      return state.courses[course_slug].chapters[chapter_slug].levels[level_slug];
    }
    catch(e){
      if(state.courses.hasOwnProperty(course_slug) && ((state.courses[course_slug].hasOwnProperty('exists') && !state.courses[course_slug].exists) || (state.courses[course_slug].chapters[chapter_slug].hasOwnProperty('exists') && !state.courses[course_slug].chapters[chapter_slug].exists))){
        return {
          exists: false
        };
      }
      return null;
    }
  },
  getCourse: (state) => (course_slug) => {
    return state.courses[course_slug];
  }
}

//to handle actions
const actions = {

  getAccount({ commit, state }) {
    if(state.account == null){
      api_request('GET','/account/details').then((resp) => {
        commit("SET_ACCOUNT",resp);
      });
    }
  },

  async getLevel({ commit, state, dispatch }, { course_slug, chapter_slug, level_slug }){

      if(!state.courses.hasOwnProperty(course_slug) || !state.courses[course_slug].hasOwnProperty('chapters')){
        //Course not fetched yet
        let resp = await api_request('GET','/courses/' + course_slug);
        await commit("SET_COURSE",{
          course: resp,
          course_slug: course_slug
        });
      }
      if(!state.courses[course_slug].chapters.hasOwnProperty(chapter_slug)){
          //Chapter does not exist
          await commit("SET_CHAPTER",{
            course_slug: course_slug,
            chapter_slug: chapter_slug,
            data: {
              exists: false
            }
          });
      }
      else if(!state.courses[course_slug].chapters[chapter_slug].levels.hasOwnProperty(level_slug) || !state.courses[course_slug].chapters[chapter_slug].levels[level_slug].hasOwnProperty('brief')){
        //Level not been fetched yet
        let resp = await api_request('GET','/courses/'+course_slug+'/chapters/'+chapter_slug+'/level/'+level_slug);
        await commit("SET_LEVEL",{
          level: resp,
          course_slug: course_slug,
          chapter_slug: chapter_slug,
          level_slug: level_slug,
        });
      }

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
  },

  SET_LEVEL(state, { level,course_slug,chapter_slug,level_slug }){
    if(level.status == "success"){
      state.courses[course_slug].chapters[chapter_slug].levels[level.level_slug] = level;
      state.courses[course_slug].chapters[chapter_slug].levels[level.level_slug].exists = true;
    } else {
      state.courses[course_slug].chapters[chapter_slug].levels[level_slug] = {};
      state.courses[course_slug].chapters[chapter_slug].levels[level_slug].exists = false;
    }
  },

  SET_COURSE(state, { course,course_slug }){
    if(course.status == "success"){
      state.courses[course.course_slug] = course;
      state.courses[course.course_slug].exists = true;
    }
    else{
      state.courses[course_slug] = {};
      state.courses[course_slug].exists = false;
    }
  },

  SET_CHAPTER(state, { course_slug,chapter_slug,data }){
    state.courses[course_slug].chapters[chapter_slug] = data;
  }


}


export default createStore({
  state: state,
  getters: getters,
  mutations: mutations,
  actions: actions,
  modules: {}
})
