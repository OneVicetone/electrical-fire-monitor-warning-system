<template>
    <Dialog v-model="visibles" title="安装照片" class="dialog-pic">
        <slot></slot>
        <div class="installList">
            <div class="show-pic" v-for="(item, index) in showPic" :key="index" >
                <img class="pic" :src="item" alt="">
                <img class="icon-delete" src="@/assets/icons/delete.png" @click="deleteImg(item)" alt="">
            </div>
            <a-upload
                class="uploader"
                name="avatar"
                list-type="picture-card"
                :show-upload-list="false"
                :customRequest="handleUploadFile"
            >
                <div>
                    <a-icon type="plus" />
                </div>
            </a-upload>
        </div>
    </Dialog>
</template>

<script>
import Dialog from "components/Dialog.vue"
import { dialogControl, uploadFileMixin } from "mixins"

export default {
    name:"AccordPic",
    components: { Dialog },
    mixins: [dialogControl, uploadFileMixin],
    props: {
        havePic: Array
    },
    data() {
        return {
        }
    },
    computed: {
        showPic() {
            return this.havePic.length && this.havePic;
        }
    },
    mounted() {
        this.getUploadUrl();
    },
    methods: {
        handleUploadFile(arg) {
			arg.file instanceof File &&
				this.toUploadFile(arg.file).then(imgUrl => {
                    console.log(imgUrl)
                    this.$emit('add-pic', imgUrl)
				})
        },
        deleteImg(url) {
            this.$emit('on-delete-img', url);
        }
    },
}
</script>
<style lang='less' scoped>
.dialog-pic {
    .installList {
        display: flex;
        flex-wrap: wrap;
        .show-pic {
            position: relative;
            margin-right: .96rem;
            .pic {
                width: 13.42rem;
                height: 13.42rem;
                margin-top: 2.17rem;
                margin-left: 2.5rem;
                position: relative;
            }
            .icon-delete {
                width: 1.92rem;
                height: 1.92rem;
                position: absolute;
                right: -1rem;
                top: 1.15rem;
                cursor: pointer;
            }
        }
        /deep/ .uploader {
                display: contents;
            .ant-upload {
                width: 13.42rem;
                height: 13.42rem;
                margin-top: 2.17rem;
                margin-left: 2.5rem;
            }
            img {
                width: calc(13.42rem - 16px);
                height: calc(13.42rem - 16px);
            }
        }

        /deep/ .ant-upload-list-picture-card-container {
            width: 13.42rem;
            height: 13.42rem;
        }

        /deep/ .ant-upload-list-picture-card {
            float: left;
        }

        /deep/ .ant-upload-list-picture-card .ant-upload-list-item {
            width: 13.42rem;
            height: 13.42rem;
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
    }
}
</style>