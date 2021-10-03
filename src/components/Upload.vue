<template>
    <div>
        <a-upload class="uploader" list-type="picture-card" :customRequest="handleUploadFile" :remove="imgDel"
              :file-list="fileList" @preview="handlePreview">
              <div v-if="fileList.length < len">
                <a-icon type="plus" />
            </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 50rem;height: 50rem" :src="previewImage" />
        </a-modal>
        <slot></slot>
    </div>
</template>

<script>
import { uploadFileMixin } from "mixins"

export default {
    name:"Upload",
    mixins: [uploadFileMixin],
    props: {
        len: {
            type: Number,
            default: 6
        }
    },
    data() {
        return {
            uploadPic: '',
            loading: false,
            fileList: [],
            previewVisible: false,
            previewImage:''
        }
    },
    mounted() {
        this.getUploadUrl()
    },
    methods: {
        imgDel(file) {
            const findIndex = this.fileList.findIndex( ({ uid }) => uid === file.uid)
            this.fileList.splice(findIndex, 1);
            this.$emit('is-done', this.fileList);
        },
        handleUploadFile(arg) {
			arg.file instanceof File &&
				this.toUploadFile(arg.file).then(imgUrl => {
                    this.uploadPic = imgUrl;
                    this.fileList.push({
                        uid: arg.file.uid,
                        name: arg.file.name,
                        status: 'done', // 根据请求判断
                        url: imgUrl,
                    })
                    this.$emit('is-done', this.fileList);
				})
        },
        handleCancel() {
            this.previewVisible = false;
        },
        // 打开模态框（图片预览）
        async handlePreview(file) {
            console.log(file);
            this.previewImage = this.uploadPic;
            this.previewVisible = true;
        },
    }
}
</script>
<style lang='less' scoped>
/deep/ .uploader {
    .ant-upload {
        width: 6.67rem;
        height: 6.67rem;
    }
    img {
        width: calc(6.67rem - 16px);
        height: calc(6.67rem - 16px);
    }
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