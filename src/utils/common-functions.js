const addMapScript = (key, version = "3.0") => {
	return new Promise(resolve => {
		const script = document.createElement("script")
		script.setAttribute("type", "text/javascript")
		script.setAttribute("src", `http://api.map.baidu.com/api?v=${version}&ak=${key}&callback=mapLoadedCallback`)
		window.mapLoadedCallback = () => resolve(BMap)
		document.body.append(script)
	})
}

const initMapTheme = map => {
	const styleId = "3d71dc5a4ce6222d3396801dee06622d"
	// const styleId = "30bfa71ded81033f80e564786b7a3885" // 需求文档里的
	map.setMapStyleV2({
		styleId,
	})
}
export { addMapScript, initMapTheme }
