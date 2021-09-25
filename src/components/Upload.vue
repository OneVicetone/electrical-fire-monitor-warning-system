<template>
    <div>
        <a-upload
            :list-type="uploadInlineStyle"
            class="uploader"
            :action="address"
            :file-list="fileList"
            @change="handleChange"
        >
            <div v-if="limitLen">
                <a-icon type="plus" />
            </div>
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
        address: {
            type: String,
            default: 'https://www.mocky.io/v2/5cc8019d300000980a055e76'
        },
        len: Number,
        fileList: Array
    },
    data() {
        return {
        }
    },
    computed: {
        limitLen() {
            return this.fileList.length < this.len;
        }
    },
    methods: {
        // beforeUpload(file) {
        //     this.log(file)
        // },
        handleChange({ fileList }) {
            console.log(fileList)
            this.$emit('upload-change', fileList)
        },
    }
}
</script>
<style lang='less' scoped>
/deep/ .uploader > .ant-upload {
  width: 6.67rem;
  height: 6.67rem;
}

/deep/ .ant-upload-list-picture-card-container {
   width: 6.67rem;
    height: 6.67rem;
}

/deep/ .ant-upload-list-picture-card {
    float: left;
}

/deep/ .ant-upload-list-picture-card .ant-upload-list-item {
    width: 6.67rem;
    height: 6.67rem;
}

/deep/ .ant-upload-list-item-uploading .ant-upload-list-item-info span {
    display: flex;
    justify-content: center;
}

/deep/ .ant-upload-list-item-uploading-text {
    font-size: 1rem;
    transform: scale(.6);
    white-space: nowrap;
}
</style>