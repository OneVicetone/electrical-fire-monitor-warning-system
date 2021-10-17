<template>
    <Dialog v-model="visibles" :title="title" :coefficient="coefficient" class="default-upload">
        <div class="container">
            <a-upload
                v-if="!url"
                name="avatar"
                list-type="picture-card"
                :show-upload-list="false"
                class="uploader"
                @beforeUpload="checkPic"
                :customRequest="handleUploadFile"
            >
                <div class="custom">
                    <i class="el-icon-upload2 icon"></i>
                    <div class="text-event">点击上传</div>
                    <div class="text-desc">
                        <p>只能上传ipg/png文件，且不超过2M</p>
                        <p>建议大小为800*560</p>
                    </div>
                </div>
            </a-upload>
            <img v-else class="show-pic" :src="url" alt="">
        </div>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import { dialogControl, uploadFileMixin } from "mixins"

export default {
    name:"DefaultUpload",
    components: { Dialog },
	mixins: [dialogControl, uploadFileMixin],
    props: {
        title: {
            type: String,
            default: ''
        },
        coefficient: {
            type: Number,
            default: 0.9
        },
        url: {
            type: String,
            required: true
        }
    },
    mounted() {
        this.getUploadUrl()
    },
    methods: {
        checkPic(file) {
            const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('图片只支持jpg/png格式哟~');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('当前图片不能超过2M哟~');
            }
            return isJpgOrPng && isLt2M;
        },
        handleUploadFile(arg) {
			arg.file instanceof File &&
				this.toUploadFile(arg.file).then(imgUrl => {
                    console.log('上传成功', imgUrl)
                    this.$emit('upload-done', imgUrl);
				})
        },
    }
}
</script>
<style lang='less' scoped>
.default-upload {
    /deep/ .ant-modal-body {
        text-align: center;
        header {
            text-align: left;
        }
    }
    .uploader {
        padding-top: 3rem;
        /deep/ .ant-upload {
            border: none;
        }
    }
    .container {
        margin-top: 2rem;
    }
    .custom {
        .icon {
            font-size: 80px;
        }
        .text {
            &-event {
                font-size: 1.17rem;
                color: rgb(26, 84, 155);
                margin: 5px 0;
            }
            &-desc {
                font-size: 1rem;
                color: #DCDCDC;
                line-height: 2rem;
            }
        }
    }
    .show-pic {
        width: 66.67rem;
        height: 46.67rem;
    }
}
</style>