<template>
    <div>
        <a-upload
            class="uploader"
            name="avatar"
            list-type="picture-card"
            :show-upload-list="false"
            :customRequest="handleUploadFile"
        >
            <img v-if="uploadPic" :src="uploadPic" />
            <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
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
    props: {
        current: Number
    },
    data() {
        return {
            uploadPic: '',
            loading: false
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
                    const num = this.current + 1;
                    this.loading  = false;
                    console.log(imgUrl)
                    this.uploadPic = imgUrl;
                    this.$emit('is-done', imgUrl, num);
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