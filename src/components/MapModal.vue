<template>
    <a-modal
        v-model="visibles" wrapClassName="map-modal"
        :closable="false" :destroyOnClose="true" :keyboard="false"
        :maskClosable="false" :footer="null" :width="widths">
        <div class="map">
            <div class="flex inputs">
                <el-autocomplete
                    v-model="form.address"
                    size="mini"
                    style="width: 21.5rem"
                    popper-class="autoAddressClass"
                    :fetch-suggestions="querySearchAsync"
                    :trigger-on-focus="false"
                    placeholder="详细地址"
                    :clearable="false"
                    @select="handleSelect"
                >
                    <template slot-scope="{ item }">
                        <div style="overflow:hidden;">
                            <div class="title">{{ item.title }}</div>
                            <span class="address ellipsis">{{ item.address }}</span>
                        </div>
                    </template>
                </el-autocomplete>
                <div class="flex-yCenter">
                    <div class="flex">
                        <div class="btn sure">确定</div>
                        <div class="btn cancel">取消</div>
                    </div>
                    <img class="icons" @click="closeMap" src="@/assets/icons/close.png" alt="">
                </div>
            </div>
            <div id="map-container" style="width:66.67rem;height:33.33rem" />
        </div>
    </a-modal>
</template>

<script>
// import Map from "components/Map.vue"
import { getBasePx } from "utils/initial"
import { dialogControl } from "mixins"

export default {
    name:"MapModal",
    // components: { Map },
    mixins: [dialogControl],
    props: {
        // 放大系数
        coefficient: {
            type: Number,
            default: 0.85
        },
        emitPoint: {
            type: Object,
            default: () => {}
        },
        edit: Boolean
    },
    data() {
        return {
            form: {
                address: '', // 详细地址
                addrPoint: { // 详细地址经纬度
                    lng: 0,
                    lat: 0
                }
            },
            map: '', // 地图实例
            mk: '', // Marker实例
            locationPoint: null,
            markClick: false
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
                    this.initMap()
                })
            }
        }
    },
    methods: {
        initMap() {
            console.log(this.emitPoint)
      var that = this
      // 1、挂载地图
      this.map = new BMapGL.Map('map-container', { enableMapClick: false })
      var point = new BMapGL.Point(118.332222, 22.223323)
      this.map.centerAndZoom(point, 19)
      // 3、设置图像标注并绑定拖拽标注结束后事件
      this.mk = new BMapGL.Marker(point, { enableDragging: true })
      this.map.addOverlay(this.mk)
      this.mk.addEventListener('dragend', function(e) {
            that.markClick = true;
            that.getAddrByPoint(e.latlng)
      })
      // 6、浏览器定位
      this.geolocation()
      // 7、绑定点击地图任意点事件
      this.map.addEventListener('click', function(e) {
            console.log('点击', e)
            that.markClick = true;
            that.getAddrByPoint(e.latlng);
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
            console.log('成功',res)
          that.getAddrByPoint(res.point)
          that.locationPoint = res.point
        } else {
        //   alert('failed' + this.getStatus())
          that.locationPoint = new BMapGL.Point(113.3324436, 23.1315381)
          that.getAddrByPoint({lng: 113.3324436,lat: 23.1315381})
        }
      }, { enableHighAccuracy: true })
    },
    // 2、逆地址解析函数
    getAddrByPoint(point) {
        console.log(point)
      var that = this
      var geco = new BMapGL.Geocoder()
      geco.getLocation(point, function(res) {
        console.log('解析',res)
        that.mk.setPosition(point)
        that.map.panTo(point)
        that.form.address = res.address
        that.form.addrPoint = point
        that.markClick && that.$emit('save-select-point', { point, address: that.form.address });
        that.markClick = false;
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
        console.log(item)
      this.form.address = item.address + item.title
      this.form.addrPoint = item.point
      this.map.clearOverlays()
      this.mk = new BMapGL.Marker(item.point)
      this.map.addOverlay(this.mk)
      this.map.panTo(item.point)
    },
    closeMap() {
        this.$emit('input', false);
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
    .map {
        position: relative;
        .inputs {
            position: absolute;
            z-index: 9999999;
            margin-top: 1.58rem;
        }
        #map-container {
            position: absolute;
        }
        .btn {
            width: 6.67rem;
            height: 2.67rem;
            line-height: 2.67rem;
            font-size: 1.17rem;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #fff;
            text-align: center;
            margin-left: .58rem;
            cursor: pointer;
            user-select: none;
            &.sure {
                background: #0188E8;
            }
            &.cancel {
                background: #81899C;
            }
        }
        .icons {
            width: 2.5rem;
            height: 2.5rem;
                position: relative;
                left: 100%;
                transform: translateX(10rem);
        }
    }
}
</style>