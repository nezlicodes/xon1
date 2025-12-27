<template>
  <ClientOnly>
    <div class="rich-text-editor">
      <QuillEditor
        v-model:content="editorContent"
        :toolbar="toolbarOptions"
        contentType="html"
        @textChange="onTextChange"
        @blur="onBlur"
        @focus="onFocus"
      />
    </div>
    <template #fallback>
      <div class="editor-loading">Loading editor...</div>
    </template>
  </ClientOnly>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Write something...'
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['text-change', 'blur', 'focus', 'update:content'])

const editorContent = ref(props.content)

// Toolbar configuration
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image']
]

// Watch for prop changes
watch(() => props.content, (newContent) => {
  if (newContent !== editorContent.value) {
    editorContent.value = newContent
  }
})

// Watch for internal changes and emit updates
watch(editorContent, (newContent) => {
  emit('update:content', newContent)
})

// Event handlers
const onTextChange = (delta, oldDelta, source) => {
  emit('text-change', {
    html: editorContent.value,
    delta,
    oldDelta,
    source
  })
}

const onBlur = (quill, event) => {
  emit('blur', {
    html: editorContent.value,
    quill,
    event
  })
}

const onFocus = (quill, event) => {
  emit('focus', {
    html: editorContent.value,
    quill,
    event
  })
}
</script>

<style>
.rich-text-editor {
  width: 100%;
  border-radius: 4px;
}

.editor-loading {
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
}

.ql-container.ql-snow{
  min-height: 200px !important;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>