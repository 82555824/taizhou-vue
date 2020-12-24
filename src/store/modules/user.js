import { login, getInfo, logout } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: {},
    roles: [],
    loadMenus: false
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    }
  },
  actions: {
    Login ({ commit }, userInfo) {
      const rememberMe = userInfo.remeberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid).then(res => {
          const token = res.data.token
          setToken(token.token, rememberMe)
          commit('SET_TOKEN', token.token)
          // setUserInfo(res.data, commit)
          commit('SET_LOAD_MENUS', true)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          setUserInfo(res.data, commit)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },
    LogOut ({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(res => {
          logOut(commit)
          resolve()
        }).catch(error => {
          logOut(commit)
          reject(error)
        })
      })
    },
    updateLoadMenus ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    }
  }
}

export const setUserInfo = (data, commit) => {
  // if(data.roles.length === 0) {
  //   commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  // }else{
  //   commit('SET_ROLES', data.roles)
  // }
  commit('SET_USER', data.user)
}

export const logOut = (commit) => {
  commit('SET_TOKEN', '')
  // commit('SET_ROLES', [])
  removeToken()
}

export default user
