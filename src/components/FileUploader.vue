<template>
  <a-card size="small" :bordered="false">
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
      <p class="ant-upload-text">{{ uploadText }}</p>
      <p class="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
        band files
      </p>
      <template #itemRender="{ file, actions }">
        <a-space class="file-item">
          <span class="file-name" :style="file.status === 'error' ? 'color: red' : ''">{{
            file.name
          }}</span>
          <span class="file-actions">
            <a href="javascript:;" @click="handleProcess(file)">process</a>
            <a
              href="javascript:;"
              @click="handleRemove(file);actions.remove($event)"
              >delete</a
            >
          </span>
        </a-space>
      </template>
    </a-upload-dragger>
  </a-card>
</template>

<script setup>
import { ref, toRaw } from 'vue'
import { message } from 'ant-design-vue'
import { InboxOutlined } from '@ant-design/icons-vue'

const fileList = ref([])

const uploadedFiles = ref(new Map())

const props = defineProps({
  uploadText: {
    type: String,
    default: 'Click or drag file to this area to upload',
  },
})

// define emit
const emits = defineEmits(['onUpload'])

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
  message.success(`${file.name} handleBeforeUpload`)
  uploadedFiles.value.set(file.uid, file)
  message.success(`${file.name} file uploaded successfully.`)

  message.success(`${fileList.value.size} read file successfully.`)

  // Handle file upload to browser using JavaScript File API
  message.success(`${file.name} read file successfully.`)
  const reader = new FileReader()
  reader.onload = (e) => {
    // Process the file data (e.target.result)
    console.log(e.target.result)
    message.success(e.target.result)

    // Emit the file data to parent component
    emits('onUpload', e.target.result)
  }
  reader.readAsDataURL(file)
  return false
}

function handleRemove(file) {
  console.log(`handleRemove ${file.name}`)
  uploadedFiles.value.delete(file.uid)
}

function handleProcess(file) {
  //    file is a proxy object, so we need to get the original file object
  const originalFile = toRaw(file)

  const fileObj = originalFile.originFileObj

  console.log(`handleProcess ${fileObj.name}`)
}

defineExpose({
  uploadedFiles,
})
</script>

<style>
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}
.file-name {
  flex: 1;
}
.file-actions {
  display: flex;
  gap: 8px;
}
</style>
