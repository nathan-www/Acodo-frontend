import {
  createStore
} from 'vuex'

import {
  api_request
} from '@/utility/ApiRequest'

import {
  ConvertTime
} from '@/utility/ConvertTime'

//to handle state
const state = {

  account: null,
  isLoggedIn: null,
  courses: {},
  profiles: {},
  loadedCourses: false,
  nonexistent_profiles:{}

}

//to handle state
const getters = {

  getProfile: (state) => (username) => {
    return state.profiles[username];
  },

  getAccount: (state) => {
    return state.account;
  },
  getLevel: (state) => (course_slug, chapter_slug, level_slug) => {
    try {
      let level = state.courses[course_slug].chapters[chapter_slug].levels[level_slug];
      if (level.hasOwnProperty('exists') && !level.exists) {
        return {
          exists: false
        };
      } else if (!level.hasOwnProperty('brief')) {
        return null;
      } else {
        return level;
      }
    } catch (e) {
      if (state.courses.hasOwnProperty(course_slug) && ((state.courses[course_slug].hasOwnProperty('exists') && !state.courses[course_slug].exists) || (state.courses[course_slug].chapters[chapter_slug].hasOwnProperty('exists') && !state.courses[course_slug].chapters[chapter_slug].exists))) {
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

  getProfile({
    commit,
    state
  }, {
    username,
    force_reload = false
  }) {

    if (!state.profiles.hasOwnProperty(username)) {
      api_request('GET', '/profile/' + username).then((resp) => {
        commit("SET_PROFILE", { profile: resp, username: username });
      });
    }

  },

  getCourses({
    commit,
    state
  }, {
    force_reload = false
  }) {
    if (!state.loadedCourses || force_reload) {
      api_request('GET', '/courses/').then((resp) => {
        commit("SET_COURSES", resp);
      });
    }
  },

  getAccount({
    commit,
    state
  }, {
    force_reload = false
  }) {
    if (state.account == null || force_reload) {
      api_request('GET', '/account/details').then((resp) => {
        commit("SET_ACCOUNT", resp);
      });
    }
  },

  getCourse({
    commit,
    state
  }, {
    course_slug,
    force_reload = false
  }) {

    if (force_reload || (!state.courses.hasOwnProperty(course_slug) || !state.courses[course_slug].hasOwnProperty('chapters'))) {
      //Course not fetched yet
      api_request('GET', '/courses/' + course_slug).then((resp) => {
        commit("SET_COURSE", {
          course: resp,
          course_slug: course_slug
        })
      });
    }

  },

  async getLevel({
    commit,
    state,
    dispatch
  }, {
    course_slug,
    chapter_slug,
    level_slug,
    force_reload = false
  }) {

    if (!state.courses.hasOwnProperty(course_slug) || !state.courses[course_slug].hasOwnProperty('chapters')) {
      //Course not fetched yet
      let resp = await api_request('GET', '/courses/' + course_slug);
      await commit("SET_COURSE", {
        course: resp,
        course_slug: course_slug
      });
    }
    if (!state.courses[course_slug].chapters.hasOwnProperty(chapter_slug)) {
      //Chapter does not exist
      await commit("SET_CHAPTER", {
        course_slug: course_slug,
        chapter_slug: chapter_slug,
        data: {
          exists: false
        }
      });
    } else if (force_reload || (!state.courses[course_slug].chapters[chapter_slug].levels.hasOwnProperty(level_slug) || !state.courses[course_slug].chapters[chapter_slug].levels[level_slug].hasOwnProperty('brief'))) {
      //Level not been fetched yet, or force reload enabled
      let resp = await api_request('GET', '/courses/' + course_slug + '/chapters/' + chapter_slug + '/level/' + level_slug);
      await commit("SET_LEVEL", {
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

  SET_ACCOUNT(state, account) {
    if (account.status == "success") {
      state.isLoggedIn = true;
      account.sessions = account.sessions.map((s) => {
        s.last_active_relative = ConvertTime(s.last_active, 'relative');
        return s;
      });
      state.account = account;
    } else {
      state.isLoggedIn = false;
    }
  },

  SET_COURSES(state, courses) {
    if (courses.status == "success") {
      state.loadedCourses = true;
      state.courses = courses;
    } else {
      state.loadedCourses = false;
    }
  },

  SET_PROFILE(state, { profile, username }) {
    if (profile.status == "success") {
      profile.last_seen_relative = ConvertTime(profile.last_seen, 'relative');
      profile.last_seen_seconds = Math.ceil((new Date()) / 1000) - profile.last_seen
      state.profiles[profile.username] = profile;
    } else {
      state.nonexistent_profiles = Object.assign({}, state.nonexistent_profiles, { [username]: true });
    }
  },

  SET_DRAFT(state, {
    course_slug,
    chapter_slug,
    level_slug,
    code
  }) {

    try {
      state.courses[course_slug].chapters[chapter_slug].levels[level_slug].draft_code.code = btoa(code);

    } catch (e) {}

  },

  SET_LEVEL(state, {
    level,
    course_slug,
    chapter_slug,
    level_slug
  }) {
    if (level.status == "success") {
      state.courses[course_slug].chapters[chapter_slug].levels[level.level_slug] = level;
      state.courses[course_slug].chapters[chapter_slug].levels[level.level_slug].exists = true;
    } else {
      state.courses[course_slug].chapters[chapter_slug].levels[level_slug] = {};
      state.courses[course_slug].chapters[chapter_slug].levels[level_slug].exists = false;
    }
  },

  SET_COURSE(state, {
    course,
    course_slug
  }) {
    if (course.status == "success") {
      state.courses[course.course_slug] = course;
      state.courses[course.course_slug].exists = true;
    } else {
      state.courses[course_slug] = {};
      state.courses[course_slug].exists = false;
    }
  },

  SET_CHAPTER(state, {
    course_slug,
    chapter_slug,
    data
  }) {
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
