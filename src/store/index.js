import accountModule from './account'

const createStore = vuexInstace => new vuexInstace.Store({
    modules: {
        account: accountModule
    }
})

export default createStore