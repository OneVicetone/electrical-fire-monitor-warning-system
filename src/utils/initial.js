export const getBasePx = scale => {
	const { width } = document.body.getBoundingClientRect()
	return width / scale
}

export const setHtmlBasePx = basePx => (document.querySelector("html").style.fontSize = `${basePx}px`)

export const initHtmlBasePx = (scale = 160) => {
	setHtmlBasePx(getBasePx(scale))
	window.onresize = () => setHtmlBasePx(getBasePx(scale))
}
