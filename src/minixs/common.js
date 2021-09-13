import { getBasePx } from 'utils/initial'

export const commonMinix = {
    methods: {
        getBasePx,
        toPath(path) {
            this.$router.push(path)
        }
    }
}