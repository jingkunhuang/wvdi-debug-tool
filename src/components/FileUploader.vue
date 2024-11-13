<template>
  <a-card size="small" :bordered="false">
    <a-upload-dragger
      accept=".txt"
      v-model:fileList="fileList"
      name="file"
      :multiple="true"
      :beforeUpload="handleBeforeUpload"
      @change="handleChange"
      @drop="handleDrop"
      @remove="handleRemove"
    >
      <p class="ant-upload-drag-icon">
        <InboxOutlined></InboxOutlined>
      </p>
      <p class="ant-upload-text">{{ uploadText }}</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
    </a-upload-dragger>
  </a-card>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'

const fileList = ref([])

const uploadedFiles = new Map()

defineProps({
  uploadText: {
    type: String,
    default: 'Click or drag file to this area to upload',
  },
})

// define emit
const emits = defineEmits(['onUpdate'])

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
  uploadedFiles.set(file.uid, file)

  emits('onUpdate', Array.from(uploadedFiles.values()))

  return false
}

function handleRemove(file) {
  console.log(`handleRemove ${file.name}`)
  uploadedFiles.delete(file.uid)
  emits('onUpdate', Array.from(uploadedFiles.values()))
  return true
}


</script>
