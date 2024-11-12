<template>
  <!-- upload file locally -->
  <a-upload-dragger
    v-model:fileList="fileList"
    name="file"
    :multiple="true"
    :beforeUpload="handleBeforeUpload"
    @change="handleChange"
    @drop="handleDrop"
  >
    <p class="ant-upload-drag-icon">
      <InboxOutlined></InboxOutlined>
    </p>
    <p class="ant-upload-text">{{uploadText}}</p>
    <p class="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
      band files
    </p>
    <template #itemRender="{ file, actions }">
      <a-space>
        <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
        <a href="javascript:;" @click="handleProcess(file)">process</a>
        <a href="javascript:;" @click="actions.remove">delete</a>
      </a-space>
    </template>
  </a-upload-dragger>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import { message } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'

// define props uploadText
const props = defineProps({
  uploadText: {
    type: String,
    default: 'Click or drag file to this area to upload',
  },
})


const fileList = ref([])
const handleChange = (info) => {
  const status = info.file.status
  if (status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (status === 'done') {
    message.success(`${info.file.name} file uploaded successfully.`)
  } else if (status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}
function handleDrop(e) {
  console.log(e)
}

function handleBeforeUpload(file) {
  // Prevent default upload behavior
  message.success(`${file.name} file uploaded successfully.`)

  // Handle file upload to browser using JavaScript File API
  message.success(`${file.name} read file successfully.`)
  const reader = new FileReader()
  reader.onload = (e) => {
    // Process the file data (e.target.result)
    console.log(e.target.result)
    message.success(e.target.result)
  }
  reader.readAsDataURL(file)
  return false
}

function handleProcess(file) {
//    file is a proxy object, so we need to get the original file object
   const originalFile = toRaw(file)

   handleBeforeUpload(originalFile.originFileObj)

  console.log(`process file ${file.name}`)

}
</script>
