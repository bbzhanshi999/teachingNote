import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:{}
  },
  getters:{
    getUser (state) {
      return state.userInfo;
    }
  },
  mutations: {
    setUser(state,data) {
      state.userInfo = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
