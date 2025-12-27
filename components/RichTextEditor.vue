<template>
  <div class="rich-text-editor">
    <QuillEditor
      v-model:content="content"
      :content-type="'html'"
      :toolbar="toolbar"
      theme="snow"
      :placeholder="placeholder"
      @update:content="handleUpdate"
      class="min-h-[150px]"
    />
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Commencez à écrire...'
  }
})

const emit = defineEmits(['update:modelValue'])

const content = ref(props.modelValue)

const toolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link']
]

const handleUpdate = (value) => {
  emit('update:modelValue', value)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== content.value) {
    content.value = newVal
  }
})
</script>

<style>
.rich-text-editor .ql-container {
  min-height: 150px;
  font-size: 16px;
}

.rich-text-editor .ql-editor {
  min-height: 150px;
}

.rich-text-editor .ql-toolbar {
  background-color: #f9fafb;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.rich-text-editor .ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
</style>