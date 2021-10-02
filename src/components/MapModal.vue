<template>
    <a-modal
        v-model="visibles" wrapClassName="map-modal"
        :closable="false" :destroyOnClose="true" :keyboard="false"
        :maskClosable="false" :footer="null" :width="widths">
        <!-- <div id="r-result">请输入:<input type="text" id="suggestId" size="20" value="百度" style="width:150px;" /></div>
	<div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div> -->
      <!-- <Map
        :customStyle="{width: '100%', height: '33.33rem'}"
        :centerPoint="mapCenterPoint"
        @setMapInstance="setMapInstance" /> -->


        <!-- <div class="addHospital">
      <div class="map">
          <a-input-search
      placeholder="input search text"
      enter-button="Search"
      size="large"
      v-model="mapName"
      @search="mapNameChange" -->
    <!-- /> -->
        <!-- <el-input placeholder="请输入搜索地址" v-model="mapName" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="mapNameChange"></el-button>
        </el-input> -->
        <!-- <div style="padding:10px 0;" v-if="mapPointName">当前选中：{{mapPointName}}</div>
        <div id="container" style="height: 400px; width: 100%" ref="allmap"></div> -->
        <!-- <Map
        :customStyle="{width: '100%', height: '33.33rem'}"
        @setMapInstance="setMapInstance" />
        <div class="map-btn"> -->
          <!-- <el-button type="primary" @click="dialogMap = false">确认</el-button> -->
        <!-- </div>
      </div> -->
  <!-- </div> -->


  <el-autocomplete
          v-model="form.address"
          style="width:100%;"
          popper-class="autoAddressClass"
          :fetch-suggestions="querySearchAsync"
          :trigger-on-focus="false"
          placeholder="详细地址"
          clearable
          @select="handleSelect"
        >
          <!-- <template slot-scope="{ item }">
            <i class="fl mgr10" />
            <div style="overflow:hidden;">
              <div class="title">{{ item.title }}</div>
              <span class="address ellipsis">{{ item.address }}</span>
            </div>
          </template> -->
        </el-autocomplete>
        <div id="map-container" style="width:100%;height:500px;" />
    </a-modal>
</template>

<script>
// import Map from "components/Map.vue"
import { getBasePx } from "utils/initial"
import { dialogControl } from "mixins"


let map = null,
  geoc = null;
export default {
    name:"MapModal",
    // components: { Map },
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
            },

        form: {address: '',
        addrPoint: { // 详细地址经纬度
          lng: 0,
          lat: 0
        }},
        map: '', // 地图实例
      mk: '', // Marker实例
      locationPoint: null

      //       dialogMap: false,
      // mapName: "",
      // mapPointName: "",
      // loading:true,
      // mapGetshow: true,
      // dialogName: ""
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
                    // this.mapBuild()
                    this.initMap()
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
            console.log(new BMapGL)
            // var map = new BMapGL.Map("l-map");
            // map.centerAndZoom("北京",12);                   // 初始化地图,设置城市和地图级别。
            var map = new BMapGL;
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
            //         map.addOverlay(new BMapGL.Marker(pp));    //添加标注
            //     }
            //     var local = new BMapGL.LocalSearch(map, { //智能搜索
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
        // setMapInstance(instance) {
		// 	new BMapGL = instance
		// },
    //     mapNameChange() {
    //   let that = this,
    //     point,
    //     marker = null;
    //   let local = new BMapGL.LocalSearch(map, {
    //     renderOptions: { map: map },
    //     onSearchComplete: res => {
    //       if (local.getResults() != undefined) {
    //         map.clearOverlays(); //清除地图上所有覆盖物
    //         if (local.getResults().getPoi(0)) {
    //           point = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
    //           map.centerAndZoom(point, 10);
    //           marker = new BMapGL.Marker(point); // 创建标注
    //           map.addOverlay(marker); // 将标注添加到地图中
    //           marker.enableDragging(); // 可拖拽
    //           geoc.getLocation(point, function(rs) {
    //             var addComp = rs.addressComponents;
    //             console.log(addComp);
    //             that.mapPointName =
    //               addComp.province +
    //               ", " +
    //               addComp.city +
    //               ", " +
    //               addComp.district +
    //               ", " +
    //               addComp.street +
    //               ", " +
    //               addComp.streetNumber;
                  
    //           });
    //         } else {
    //           alert("未匹配到地点!可拖动地图上的红色图标到精确位置");
    //         }
    //       } else {
    //         alert("未找到搜索结果");
    //       }
    //     }
    //   });
    //   local.search(this.mapName);
    // },
    // //地图显示
    // mapBuild() {
    //   let that = this;
    //   this.dialogMap = !this.dialogMap;
    //   setTimeout(function() {
    //     if (that.mapGetshow) {
    //       map = new BMapGL.Map("container");
    //       geoc = new BMapGL.Geocoder();
    //       let point = new BMapGL.Point(116.3964, 39.9093);
    //       map.centerAndZoom(point, 10);
    //       map.enableScrollWheelZoom();
    //       var geolocation = new BMapGL.Geolocation();
    //       //定位
    //       geolocation.getCurrentPosition(
    //         r => {
    //           console.log(r);
    //           var mk = new BMapGL.Marker(r.point);
    //           map.addOverlay(mk);
    //           map.panTo(r.point);
    //           geoc.getLocation(r.point, function(rs) {
    //             var addComp = rs.addressComponents;
    //             console.log(addComp);
    //             that.mapPointName =
    //               addComp.province +
    //               addComp.city +
    //               addComp.district +
    //               addComp.street +
    //               addComp.streetNumber;
    //               that.loading = false;
    //             that.mapGetshow = false;
    //           });
    //         },
    //         { enableHighAccuracy: true }
    //       );
    //       //鼠标点击
    //       map.addEventListener("click", function(e) {
    //         console.log(e);
    //         var pt = e.point;
    //         var marker = new BMapGL.Marker(pt); // 创建标注
    //         map.clearOverlays();
    //         map.addOverlay(marker);
    //         geoc.getLocation(pt, function(rs) {
    //           var addComp = rs.addressComponents;
    //           console.log(addComp);
    //           that.mapPointName =
    //             addComp.province +
    //             addComp.city +
    //             addComp.district +
    //             addComp.street +
    //             addComp.streetNumber;
    //         });
    //       });
    //     }
    //   }, 1000);
    // }
    // }



    initMap() {
      var that = this
      // 1、挂载地图
      this.map = new BMapGL.Map('map-container', { enableMapClick: false })
      var point = new BMapGL.Point(113.3324436, 23.1315381)
      this.map.centerAndZoom(point, 19)
      // 3、设置图像标注并绑定拖拽标注结束后事件
      this.mk = new BMapGL.Marker(point, { enableDragging: true })
      this.map.addOverlay(this.mk)
      this.mk.addEventListener('dragend', function(e) {
        that.getAddrByPoint(e.point)
      })
      // 4、添加（右上角）平移缩放控件
      this.map.addControl(new BMapGL.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL }))
      // 5、添加（左下角）定位控件
      var geolocationControl = new BMapGL.GeolocationControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })
      geolocationControl.addEventListener('locationSuccess', function(e) {
        that.getAddrByPoint(e.point)
      })
      geolocationControl.addEventListener('locationError', function(e) {
        alert(e.message)
      })
      this.map.addControl(geolocationControl)
      // 6、浏览器定位
      this.geolocation()
      // 7、绑定点击地图任意点事件
      this.map.addEventListener('click', function(e) {
        that.getAddrByPoint(e.point)
      })
    },
    // 获取两点间的距离
    getDistancs(pointA, pointB) {
      return this.map.getDistance(pointA, pointB).toFixed(2)
    },
    // 浏览器定位函数
    geolocation() {
      var that = this
      var geolocation = new BMapGL.Geolocation()
      geolocation.getCurrentPosition(function(res) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          that.getAddrByPoint(res.point)
          that.locationPoint = res.point
        } else {
          alert('failed' + this.getStatus())
          that.locationPoint = new BMapGL.Point(113.3324436, 23.1315381)
        }
      }, { enableHighAccuracy: true })
    },
    // 2、逆地址解析函数
    getAddrByPoint(point) {
      var that = this
      var geco = new BMapGL.Geocoder()
      geco.getLocation(point, function(res) {
        console.log(res)
        that.mk.setPosition(point)
        that.map.panTo(point)
        that.form.address = res.address
        that.form.addrPoint = point
      })
    },
    // 8-1、地址搜索
    querySearchAsync(str, cb) {
      var options = {
        onSearchComplete: function(res) {
          var s = []
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            for (var i = 0; i < res.getCurrentNumPois(); i++) {
              s.push(res.getPoi(i))
            }
            cb(s)
          } else {
            cb(s)
          }
        }
      }
      var local = new BMapGL.LocalSearch(this.map, options)
      local.search(str)
    },
    // 8-2、选择地址
    handleSelect(item) {
      this.form.address = item.address + item.title
      this.form.addrPoint = item.point
      this.map.clearOverlays()
      this.mk = new BMapGL.Marker(item.point)
      this.map.addOverlay(this.mk)
      this.map.panTo(item.point)
    },
    onSubmit() {
      console.log(this.form)
    }
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