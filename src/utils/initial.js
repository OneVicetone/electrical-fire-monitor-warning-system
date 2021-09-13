export const getBasePx = () => {
    const { width } = document.body.getBoundingClientRect()
    return width / 160
}

export const setHtmlBasePx = basePx => document.querySelector('html').style.fontSize = `${basePx}px`

export const initHtmlBasePx = () => {
    setHtmlBasePx(getBasePx())
    window.onresize = () => setHtmlBasePx(getBasePx())
}