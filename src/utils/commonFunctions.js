const addMapScript = (key, version = "1.0") => {
	return new Promise(resolve => {
		const script = document.createElement("script")
		script.setAttribute("type", "text/javascript")
		script.setAttribute(
			"src",
			`http://api.map.baidu.com/api?type=webgl&v=${version}&ak=${key}&callback=mapLoadedCallback`
		)
		window.mapLoadedCallback = () => resolve(BMapGL)
		document.body.append(script)
	})
}

const initMapTheme = (map, styleId) => {
	// const styleId = "3d71dc5a4ce6222d3396801dee06622d"
	// const styleId = "30bfa71ded81033f80e564786b7a3885" // 需求文档里的
	map.setMapStyleV2({
		styleId,
	})
}

/**
 * xml字符串转换xml对象数据
 * @param {Object} xmlStr
 */
function xmlStr2XmlObj(xmlStr) {
	let xmlObj = {}
	if (document.all) {
		const xmlDom = new ActiveXObject("Microsoft.XMLDOM")
		xmlDom.loadXML(xmlStr)
		xmlObj = xmlDom
	} else {
		xmlObj = new DOMParser().parseFromString(xmlStr, "text/xml")
	}
	return xmlObj
}

/**
 * xml转换json数据
 * @param {Object} xml
 */
function xml2json(xml) {
	try {
		var obj = {}
		if (xml.children.length > 0) {
			for (var i = 0; i < xml.children.length; i++) {
				var item = xml.children.item(i)
				var nodeName = item.nodeName
				if (typeof obj[nodeName] == "undefined") {
					obj[nodeName] = xml2json(item)
				} else {
					if (typeof obj[nodeName].push == "undefined") {
						var old = obj[nodeName]
						obj[nodeName] = []
						obj[nodeName].push(old)
					}
					obj[nodeName].push(xml2json(item))
				}
			}
		} else {
			obj = xml.textContent
		}
		return obj
	} catch (e) {
		console.log(e.message)
	}
}

/**
 * xml字符串转换json数据
 * @param {Object} xml
 */
function xmlObj2json(xml) {
	const xmlObj = xmlStr2XmlObj(xml)
	let jsonObj = {}
	if (xmlObj.childNodes.length > 0) {
		jsonObj = xml2json(xmlObj)
	}
	return jsonObj
}

function isPC() {
	const userAgentInfo = navigator.userAgent
	const Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
	let flag = true
	for (let v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false
			break
		}
	}
	return flag
}

export { addMapScript, initMapTheme, xmlStr2XmlObj, xmlObj2json, isPC }
