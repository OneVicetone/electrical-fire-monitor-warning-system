import createPersistedState from 'vuex-persistedstate'

import accountModule from './account'

const createStore = vuexInstace => new vuexInstace.Store({
    modules: {
        account: accountModule
    },
    plugins: [createPersistedState()]
})

export default createStore