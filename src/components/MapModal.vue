<template>
    <a-modal
        v-model="visibles" wrapClassName="map-modal"
        :closable="false" :destroyOnClose="true" :keyboard="false"
        :maskClosable="false" :footer="null" :width="widths">
        <!-- <div id="r-result">请输入:<input type="text" id="suggestId" size="20" value="百度" style="width:150px;" /></div>
	<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div> -->
      <Map
        :customStyle="{width: '100%', height: '33.33rem'}"
        :centerPoint="mapCenterPoint"
        @setMapInstance="setMapInstance" />
    </a-modal>
</template>

<script>
import Map from "components/Map.vue"
import { getBasePx } from "utils/initial"
import { dialogControl } from "mixins"

export default {
    name:"MapModal",
    components: { Map },
    mixins: [dialogControl],
    props: {
        // 放大系数
        coefficient: {
            type: Number,
            default: 0.85
        }
    },
    data() {
        return {
            mapCenterPoint: { lon: 118.332222, lat: 22.223323 },
            mapInstance: null,
            getAddress: {
                lng: 0,
                lat: 0
            }
        }
    },
    computed: {
        widths() {
			return getBasePx() * 83.12 * this.coefficient;
		}
    },
    watch: {
        visibles(v) {
            if (v) {
                this.$nextTick(() => {
                    this.iptFunc()
                })
            }
        }
    },
    methods: {
        iptFunc() {
            function G(id) {
                return document.getElementById(id);
            }
            let that = this;
            console.log(this.mapInstance)
            // var map = this.mapInstance.Map("l-map");
            // map.centerAndZoom("北京",12);                   // 初始化地图,设置城市和地图级别。
            var map = this.mapInstance;
            // var ac = new BMapGL.Autocomplete(    //建立一个自动完成的对象
            //     {"input" : "suggestId"
            //     ,"location" : map
            // });
            // console.log(ac)
            // ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
            // var str = "";
            //     var _value = e.fromitem.value;
            //     var value = "";
            //     if (e.fromitem.index > -1) {
            //         value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            //     }    
            //     str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
                
            //     value = "";
            //     if (e.toitem.index > -1) {
            //         _value = e.toitem.value;
            //         value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            //     }    
            //     str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            //     G("searchResultPanel").innerHTML = str;
            // });
        
            // var myValue;
            // ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
            // var _value = e.item.value;
            //     myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            //     G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                
            //     setPlace();
            // });
        
            // function setPlace(){
            //     map.clearOverlays();    //清除地图上所有覆盖物
            //     function myFun(){
            //         var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            //         map.centerAndZoom(pp, 18);
            //         map.addOverlay(this.mapInstance.Marker(pp));    //添加标注
            //     }
            //     var local = this.mapInstance.LocalSearch(map, { //智能搜索
            //     onSearchComplete: myFun
            //     });
            //     local.search(myValue);
            // }
            map.addEventListener("click",function(e){
	            console.log(e)
                const {lng, lat} = e.point;
                console.log(lng, lat, that)
                that.getAddress = {lng, lat};
                that.$emit('input', false);
                that.$emit('emit-coordinate', {lng, lat})
            })

        },
        setMapInstance(instance) {
			this.mapInstance = instance
		},
    }
}
</script>
<style lang='less' scoped>
/deep/ .map-modal {
    .ant-modal-header {
        display: none;
    }
    .ant-modal-body {
        padding: 0;
    }
}
</style>