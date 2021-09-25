<template>
    <div>
        <a-upload
            :name="fileName"
            :list-type="uploadInlineStyle"
            class="uploader"
            :show-upload-list="showUploadList"
            :action="address"
            :before-upload="beforeUpload"
            @change="handleChange"
        >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <a-icon  v-else :type="loading ? 'loading' : 'plus'" />
        </a-upload>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:"Upload",
    props: {
        fileName: {
            type: String,
            default: 'file'
        },
        uploadInlineStyle: {
            type: String,
            default: 'picture-card'
        },
        showUploadList: {
            type: Boolean,
            default: false
        },
        address: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            loading: false,
            imageUrl: ''
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {
        beforeUpload(file) {
            console.log(file)
        },
        handleChange(info) {
            console.log(info)
        }
    }
}
</script>
<style lang='less' scoped>
/deep/ .uploader > .ant-upload {
  width: 13.42rem;
  height: 13.42rem;
  background: #090D18;
  margin: 0;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>