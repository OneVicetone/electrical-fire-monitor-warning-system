import { setTokenByCookie } from "utils/commonFunctions"

export const phonePageMixin = {
    mounted() {
        setTokenByCookie()
    }
}
