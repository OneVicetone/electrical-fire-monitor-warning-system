<template>
    <div>
        <a-upload
            name="avatar"
            list-type="picture-card"
            :show-upload-list="false"
            :customRequest="handleUploadFile"
        >
            <img v-if="uploadPic" :src="uploadPic" />
            <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传图片</div>
            </div>
        </a-upload>
        <slot></slot>
    </div>
</template>

<script>
import { uploadFileMixin } from "mixins"

export default {
    name:"Upload",
    mixins: [uploadFileMixin],
    data() {
        return {
        }
    },
    computed: {
        limitLen() {
            return this.fileList.length < this.len;
        }
    },
    mounted() {
        this.getUploadUrl()
    },
    methods: {
        handleUploadFile(arg) {
            console.log('上传文件', arg)
			arg.file instanceof File &&
				this.toUploadFile(arg.file).then(imgUrl => {
                    this.loading  = false;
                    console.log(imgUrl)
                    this.uploadPic = imgUrl;
				})
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