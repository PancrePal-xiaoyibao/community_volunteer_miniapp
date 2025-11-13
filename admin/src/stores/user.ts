import { defineStore } from 'pinia'

interface UserState {
  token: string | null
  name: string
  avatar: string
  role: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: null,
    name: '管理员',
    avatar: '',
    role: 'admin'
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
    
    setUserInfo(userInfo: Partial<UserState>) {
      Object.assign(this, userInfo)
    },
    
    logout() {
      this.token = null
      this.name = '管理员'
      this.avatar = ''
      this.role = 'admin'
    }
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage
      }
    ]
  }
})