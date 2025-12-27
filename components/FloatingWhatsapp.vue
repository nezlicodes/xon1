<template>
  <div
    v-if="whatsappUrl"
    :class="[
      'fixed z-50 flex items-center group pointer-events-none',
      isRtl ? 'left-6 flex-row-reverse' : 'right-6 flex-row',
      'bottom-6'
    ]"
  >
    <div 
      :class="[
        'px-5 py-2.5 bg-white/90 backdrop-blur-md text-slate-900 text-sm font-semibold rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out pointer-events-none flex items-center gap-2',
        isRtl ? 'ml-4' : 'mr-4'
      ]"
    >
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      {{ isRtl ? 'تحدث معنا' : 'Chat with us' }}
    </div>

    <a
      :href="whatsappUrl"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      class="relative flex items-center justify-center w-16 h-16 rounded-full text-white bg-[#25D366] shadow-[0_15px_30px_-5px_rgba(37,211,102,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(37,211,102,0.6)] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-110 active:scale-90 pointer-events-auto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-8 h-8 fill-current drop-shadow-sm"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.066 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .054 5.391.051 11.996c0 2.112.551 4.171 1.597 6.01L0 24l6.135-1.61a11.843 11.843 0 005.912 1.569h.005c6.608 0 12-5.392 12.003-11.998a11.821 11.821 0 00-3.483-8.42z" />
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { siteSettings } = useSiteSettings()
const { isRtl } = useTranslation()

const rawValue = computed(() => siteSettings.value?.floatingWhatsapp || '')

const whatsappUrl = computed(() => {
  const value = (rawValue.value || '').trim()
  if (!value) return ''
  
  if (/^https?:\/\//i.test(value)) return value
  
  const digits = value.replace(/[^\d]/g, '')
  if (!digits) return ''
  
  const text = encodeURIComponent('Hello! I would like to know more about your products.')
  return `https://wa.me/${digits}?text=${text}`
})
</script>