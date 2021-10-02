import { Input, Autocomplete } from 'element-ui'
import 'element-ui/lib/theme-chalk/input.css';
import 'element-ui/lib/theme-chalk/autocomplete.css';

export default {
    install (Vue) {
        Vue.use(Input)
        Vue.use(Autocomplete)
    }
}