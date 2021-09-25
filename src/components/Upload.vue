<template>
    <div class="clearfix">
        <a-upload
            :list-type="uploadInlineStyle"
            class="uploader"
            :action="address"
            :file-list="fileList"
            @change="handleChange"
        >
            <!-- <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
            <a-icon  v-else :type="loading ? 'loading' : 'plus'" /> -->
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
        len: Number
    },
    data() {
        return {
            loading: false,
            imageUrl: '',
            fileList: [{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-2',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-3',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-4',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
        {
          uid: '-5',
          name: 'image.png',
          status: 'error',
        },]
        }
    },
    computed: {
        limitLen() {
            return this.fileList.length < this.len;
        }
    },
    methods: {
        beforeUpload(file) {
            this.log(file)
        },
        handleChange({ fileList }) {
            this.fileList = fileList;
        },
    }
}
</script>
<style lang='less' scoped>
/deep/ .uploader > .ant-upload {
  width: 6.67rem;
  height: 6.67rem;
//   background: #090D18;
//   margin: 0;
}
/deep/ .ant-upload-list-picture-card-container {
   width: 6.67rem;
    height: 6.67rem;
}
/deep/ .ant-upload-list-picture-card .ant-upload-list-item {
    width: 6.67rem;
    height: 6.67rem;
}
// .ant-upload-select-picture-card i {
//   font-size: 32px;
//   color: #999;
// }

// .ant-upload-select-picture-card .ant-upload-text {
//   margin-top: 8px;
//   color: #666;
// }
</style>