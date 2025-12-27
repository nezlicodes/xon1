<template>
  <div class="space-y-3">
    <!-- About Section Preview with Inline Editing - WYSIWYG -->
    <div class="bg-white shadow overflow-hidden relative">
      
      <!-- Floating Control Bar -->
      <div class="absolute top-4 right-4 z-50 flex items-center gap-2">
        <!-- Visibility Toggle -->
        <button
          @click="toggleVisibility"
          class="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all duration-300"
          :title="sectionData.is_active ? 'Hide About Section' : 'Show About Section'"
        >
          <Icon
            :name="sectionData.is_active ? 'heroicons-outline:eye' : 'heroicons-outline:eye-off'"
            class="h-5 w-5 text-gray-700"
          />
        </button>

        <!-- Layout Selector -->
        <div class="relative">
          <button
            @click="showLayoutPicker = !showLayoutPicker"
            class="px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300"
          >
            <Icon name="heroicons-outline:view-grid" class="w-4 h-4" />
            Layout
          </button>
          
          <div v-if="showLayoutPicker" class="absolute right-0 top-12 bg-white rounded-lg shadow-xl p-4 min-w-[250px] space-y-2 z-50">
            <button
              v-for="layout in layoutOptions"
              :key="layout.value"
              @click="selectLayout(layout.value)"
              class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              :class="galleryLayout === layout.value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'"
            >
              <div class="flex items-center gap-2">
                <Icon :name="layout.icon" class="w-4 h-4" />
                <span class="text-sm">{{ layout.label }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Color Picker -->
        <div class="relative">
          <button
            @click="showColorPicker = !showColorPicker"
            class="px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300"
          >
            <Icon name="heroicons-outline:color-swatch" class="w-4 h-4" />
            Colors
          </button>
          
          <div v-if="showColorPicker" class="absolute right-0 top-12 bg-white rounded-lg shadow-xl p-4 min-w-[300px] space-y-3 z-50">
            <h4 class="text-sm font-medium text-gray-700 mb-3">Color Scheme</h4>
            <button
              @click="applyColorScheme('primary')"
              class="w-full p-3 rounded-lg border-2 border-primary bg-primary text-contrast1 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Primary Colors
            </button>
            <button
              @click="applyColorScheme('secondary')"
              class="w-full p-3 rounded-lg border-2 border-secondary bg-secondary text-contrast2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Secondary Colors
            </button>
            <button
              @click="applyColorScheme('body')"
              class="w-full p-3 rounded-lg border-2 border-gray-300 bg-background text-mgray text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Body Colors
            </button>
          </div>
        </div>

        <!-- Media Manager -->
        <button
          @click="showMediaManager = true"
          class="px-3 py-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium text-gray-700 transition-all duration-300"
        >
          <Icon name="heroicons-outline:photograph" class="w-4 h-4" />
          Gallery ({{ mediaItems.length }})
        </button>
      </div>

      <!-- Collapsed State -->
      <div
        v-if="!sectionData.is_active"
        class="flex items-center justify-center py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg"
      >
        <div class="text-center">
          <Icon name="heroicons-outline:information-circle" class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">About Section Hidden</h3>
          <p class="mt-1 text-sm text-gray-500">Click the eye icon to show the about section</p>
        </div>
      </div>

      <!-- WYSIWYG Section Preview - Matches Front-End Exactly -->
      <section
        v-if="sectionData.is_active"
        class="relative overflow-hidden"
        :style="{
          backgroundColor: sectionData.background_color || 'transparent',
          color: sectionData.text_color || '#1a1a1a',
        }"
      >
        <!-- Hero Overlay Layout -->
        <div
          v-if="galleryLayout === 'hero-overlay'"
          class="relative min-h-[70vh] lg:min-h-[850px] flex items-center"
        >
          <div class="absolute inset-0">
            <video
              v-if="visibleMedia[0]?.type === 'video'"
              :src="visibleMedia[0]?.url"
              class="w-full h-full object-cover"
              autoplay
              loop
              muted
              playsinline
            />
            <img
              v-else-if="visibleMedia[0]"
              :src="visibleMedia[0]?.url"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div class="relative z-10 w-full px-6 max-w-7xl mx-auto">
            <!-- Subtitle -->
            <div v-if="sectionData.additional_data?.subtitle" class="relative inline-block group mb-6">
              <p class="text-lg lg:text-xl opacity-90 font-medium tracking-wide text-white">
                {{ getTranslation(sectionData.additional_data.subtitle) }}
              </p>
              <button
                @click="openFieldEditor('subtitle')"
                class="absolute -top-2 -right-8 bg-white/90 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Icon class="w-3 h-3 text-gray-700" name="heroicons-outline:pencil" />
              </button>
            </div>

            <!-- Title -->
            <div class="relative inline-block group mb-8">
              <h2 class="text-5xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white">
                {{ currentTitle || 'Click to add title' }}
              </h2>
              <button
                @click="openFieldEditor('title')"
                class="absolute -top-3 -right-12 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Icon class="w-4 h-4 text-gray-700" name="heroicons-outline:pencil" />
              </button>
            </div>

            <!-- Content -->
            <div class="relative inline-block group mb-8">
              <p class="text-xl lg:text-2xl font-light opacity-90 max-w-2xl leading-relaxed text-white">
                {{ currentContent || 'Click to add description' }}
              </p>
              <button
                @click="openFieldEditor('content')"
                class="absolute -top-2 -right-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <Icon class="w-4 h-4 text-gray-700" name="heroicons-outline:pencil" />
              </button>
            </div>

            <!-- Key Points -->
            <div v-if="keyPoints.length" class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <div
                v-for="(point, index) in keyPoints"
                :key="index"
                @click="editKeyPoint(index)"
                class="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 cursor-pointer hover:bg-white/20 transition-all group"
              >
                <Icon name="heroicons-outline:check-circle" class="h-6 w-6 text-green-400 flex-shrink-0" />
                <span class="font-medium text-white flex-1">
                  {{ point.text_translations?.[editorLanguage] || 'Click to edit' }}
                </span>
                <Icon class="w-4 h-4 text-white opacity-0 group-hover:opacity-100" name="heroicons-outline:pencil" />
              </div>
              <button
                @click="addKeyPoint"
                class="flex items-center justify-center gap-3 py-3 border-2 border-dashed border-white/30 rounded-xl hover:border-white/60 hover:bg-white/5 transition-all text-white"
              >
                <Icon name="heroicons-outline:plus-circle" class="h-5 w-5" />
                <span>Add key point</span>
              </button>
            </div>
            <button
              v-else
              @click="addKeyPoint"
              class="mt-12 flex items-center justify-center gap-3 px-6 py-3 border-2 border-dashed border-white/30 rounded-xl hover:border-white/60 hover:bg-white/5 transition-all text-white"
            >
              <Icon name="heroicons-outline:plus-circle" class="h-5 w-5" />
              <span>Add key points</span>
            </button>
          </div>
        </div>

        <!-- Other Layouts -->
        <div v-else class="py-16 lg:py-32 px-6">
          <div class="max-w-7xl mx-auto">
            
            <!-- Header Section (for non-hero, non-two-column layouts) -->
            <div
              v-if="!['hero-overlay', 'two-column'].includes(galleryLayout) && (currentTitle || currentContent)"
              class="mb-20"
            >
              <!-- Subtitle -->
              <div v-if="sectionData.additional_data?.subtitle" class="relative inline-block group mb-4">
                <p class="font-bold tracking-widest uppercase text-sm">
                  {{ getTranslation(sectionData.additional_data.subtitle) }}
                </p>
                <button
                  @click="openFieldEditor('subtitle')"
                  class="absolute -top-2 -right-8 bg-primary/90 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Icon class="w-3 h-3 text-white" name="heroicons-outline:pencil" />
                </button>
              </div>

              <!-- Title -->
              <div class="relative inline-block group mb-8">
                <h2 class="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1]">
                  {{ currentTitle || 'Click to add title' }}
                </h2>
                <button
                  @click="openFieldEditor('title')"
                  class="absolute -top-3 -right-12 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
                </button>
              </div>

              <!-- Content -->
              <div v-if="currentContent" class="relative inline-block group mb-10">
                <p class="text-xl lg:text-2xl max-w-3xl leading-relaxed">
                  {{ currentContent }}
                </p>
                <button
                  @click="openFieldEditor('content')"
                  class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
                </button>
              </div>

              <!-- Key Points -->
              <div v-if="keyPoints.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="(point, index) in keyPoints"
                  :key="index"
                  @click="editKeyPoint(index)"
                  class="flex items-center gap-3 rounded-xl p-4 cursor-pointer hover:bg-black/5 transition-all group"
                >
                  <Icon name="heroicons-outline:check-circle" class="h-6 w-6 text-green-600 flex-shrink-0" />
                  <span class="font-medium flex-1">{{ point.text_translations?.[editorLanguage] || 'Click to edit' }}</span>
                  <Icon class="w-4 h-4 opacity-0 group-hover:opacity-100" name="heroicons-outline:pencil" />
                </div>
                <button
                  @click="addKeyPoint"
                  class="flex items-center justify-center gap-3 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all"
                >
                  <Icon name="heroicons-outline:plus-circle" class="h-5 w-5" />
                  <span>Add point</span>
                </button>
              </div>
            </div>

            <!-- Two Column Layout -->
            <div
              v-if="galleryLayout === 'two-column'"
              class="flex flex-col lg:gap-24 items-center"
              :class="imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'"
            >
              <!-- Content Side -->
              <div class="flex-1 lg:max-w-2xl">
                <!-- Title -->
                <div class="relative inline-block group mb-8">
                  <h2 class="text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1]">
                    {{ currentTitle || 'Click to add title' }}
                  </h2>
                  <button
                    @click="openFieldEditor('title')"
                    class="absolute -top-3 -right-12 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
                  </button>
                </div>

                <!-- Content -->
                <div v-if="currentContent" class="relative inline-block group mb-10">
                  <p class="text-xl leading-relaxed">
                    {{ currentContent }}
                  </p>
                  <button
                    @click="openFieldEditor('content')"
                    class="absolute -top-2 -right-10 bg-primary p-2 rounded-full text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Icon class="w-4 h-4" name="heroicons-outline:pencil" />
                  </button>
                </div>

                <!-- Key Points -->
                <div v-if="keyPoints.length" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    v-for="(point, index) in keyPoints"
                    :key="index"
                    @click="editKeyPoint(index)"
                    class="flex items-center gap-3  rounded-xl p-4 border  cursor-pointer transition-all group"
                  >
                    <Icon name="heroicons-outline:check-circle" class="h-6 w-6 text-green-600 flex-shrink-0" />
                    <span class="font-medium flex-1">{{ point.text_translations?.[editorLanguage] || 'Click to edit' }}</span>
                    <Icon class="w-4 h-4 opacity-0 group-hover:opacity-100" name="heroicons-outline:pencil" />
                  </div>
                  <button
                    @click="addKeyPoint"
                    class="flex items-center justify-center gap-3 py-3 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all"
                  >
                    <Icon name="heroicons-outline:plus-circle" class="h-5 w-5" />
                    <span>Add point</span>
                  </button>
                </div>
                
                <!-- Image Position Toggle -->
                <button
                  @click="toggleImagePosition"
                  class="mt-6 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Icon name="heroicons-outline:switch-horizontal" class="w-4 h-4" />
                  {{ imagePosition === 'left' ? 'Move Gallery Right' : 'Move Gallery Left' }}
                </button>
              </div>

              <!-- Gallery Side -->
              <div class="flex-1 w-full mt-12 lg:mt-0">
                <div class="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video lg:aspect-square">
                  <transition name="fade" mode="out-in">
                    <div :key="currentSlide" class="absolute inset-0">
                      <video
                        v-if="visibleMedia[currentSlide]?.type === 'video'"
                        :src="visibleMedia[currentSlide]?.url"
                        class="w-full h-full object-cover"
                        autoplay
                        loop
                        muted
                        playsinline
                      />
                      <img
                        v-else-if="visibleMedia[currentSlide]"
                        :src="visibleMedia[currentSlide]?.url"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </transition>
                  <div v-if="visibleMedia.length > 1" class="absolute bottom-6 right-6 flex gap-2">
                    <button
                      @click="prevSlide"
                      class="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <Icon name="heroicons-outline:chevron-left" class="w-6 h-6" />
                    </button>
                    <button
                      @click="nextSlide"
                      class="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    >
                      <Icon name="heroicons-outline:chevron-right" class="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grid Layout -->
            <div v-else-if="galleryLayout === 'grid'" class="flex flex-col gap-16 lg:gap-24">
              <div
                v-for="media in visibleMedia"
                :key="media.id"
                class="group w-full bg-white rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-100 relative"
              >
                <!-- Edit Button -->
                <button
                  @click="editMedia(media)"
                  class="absolute top-6 right-6 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Icon name="heroicons-outline:pencil" class="w-4 h-4 text-gray-700" />
                </button>

                <div class="w-full bg-black">
                  <video
                    v-if="media.type === 'video'"
                    :src="media.url"
                    class="w-full h-auto block"
                    autoplay
                    loop
                    muted
                    playsinline
                  />
                  <img v-else :src="media.url" class="w-full h-auto block" />
                </div>
                <div v-if="mediaTitle(media) || mediaDescription(media)" class="p-8 lg:p-16">
                  <div class="max-w-4xl">
                    <h3 v-if="mediaTitle(media)" class="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">
                      {{ mediaTitle(media) }}
                    </h3>
                    <p v-if="mediaDescription(media)" class="text-xl lg:text-2xl leading-relaxed font-light">
                      {{ mediaDescription(media) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cards Layout -->
            <div v-else-if="galleryLayout === 'cards'" class="flex flex-col gap-24 lg:gap-40">
              <div
                v-for="(media, index) in visibleMedia"
                :key="media.id"
                class="flex flex-col lg:flex-row w-full items-center group"
                :class="[index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse']"
              >
                <!-- Media Side -->
                <div class="w-full lg:w-max flex-shrink relative">
                  <!-- Edit Button -->
                  <button
                    @click="editMedia(media)"
                    class="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Icon name="heroicons-outline:pencil" class="w-4 h-4 text-gray-700" />
                  </button>

                  <div class="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm bg-black">
                    <video
                      v-if="media.type === 'video'"
                      :src="media.url"
                      class="block w-full h-auto max-h-[75vh] lg:w-auto"
                      autoplay
                      loop
                      muted
                      playsinline
                    />
                    <img
                      v-else
                      :src="media.url"
                      class="block w-full h-auto max-h-[75vh] lg:w-auto"
                    />
                  </div>
                </div>

                <!-- Content Side -->
                <div
                  class="flex-1 min-w-[25%] lg:min-w-[300px]"
                  :class="[index % 2 === 0 ? 'lg:pl-12 xl:pl-20' : 'lg:pr-12 xl:pr-20']"
                >
                  <div class="py-10 lg:py-4">
                    
                    <h3 v-if="mediaTitle(media)" class="text-3xl lg:text-5xl font-bold mb-6 leading-tight tracking-tighter">
                      {{ mediaTitle(media) }}
                    </h3>
                    <p v-if="mediaDescription(media)" class="text-lg lg:text-xl leading-relaxed font-light">
                      {{ mediaDescription(media) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="visibleMedia.length === 0" class="text-center py-20">
              <Icon name="heroicons-outline:photograph" class="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p class="text-lg text-gray-600 mb-6">No media yet</p>
              <button
                @click="showMediaManager = true"
                class="px-6 py-3 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 transition-all shadow-lg"
              >
                Add Your First Media
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>

    <!-- Field Editor Modal -->
    <div v-if="editingField !== null" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" @click.self="closeFieldEditor">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">
          Edit {{ getFieldName() }}
        </h3>
        
        <AdminFormField
          v-if="editingField === 'title'"
          v-model="editData.title_translations[editorLanguage]"
          type="text"
          label="Section Title"
          placeholder="About Our Technology"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />

        <AdminFormField
          v-else-if="editingField === 'subtitle'"
          v-model="editData.additional_data.subtitle[editorLanguage]"
          type="text"
          label="Subtitle"
          placeholder="Our Story"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />
        
        <AdminFormField
          v-else-if="editingField === 'content'"
          v-model="editData.content_translations[editorLanguage]"
          type="textarea"
          label="Description"
          :rows="6"
          placeholder="Detailed description..."
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />

        <AdminFormField
          v-else-if="typeof editingField === 'number'"
          v-model="editData.additional_data.key_points[editingField].text_translations[editorLanguage]"
          type="text"
          label="Key Point"
          placeholder="Enter key benefit or feature"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            v-if="typeof editingField === 'number'"
            @click="removeKeyPoint(editingField)"
            class="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
          <button
            @click="closeFieldEditor"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveField"
            class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Media Manager Modal -->
    <div v-if="showMediaManager" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" @click.self="showMediaManager = false">
      <div class="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-semibold text-gray-800">Media Gallery Manager</h3>
              <p class="text-sm text-gray-500 mt-1">Upload and manage images or videos</p>
            </div>
            <button
              @click="showMediaManager = false"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Icon name="heroicons-outline:x" class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-6">
          <!-- Upload Area -->
          <div class="space-y-3">
            <label class="block text-sm font-medium text-gray-700">Upload New Media</label>
            <label class="cursor-pointer block">
              <div class="px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary transition-colors">
                <Icon name="heroicons-outline:cloud-upload" class="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p class="text-sm font-medium text-gray-700">Click to upload images or videos</p>
                <p class="text-xs text-gray-500 mt-1">JPG, PNG, GIF, MP4, WEBM up to 10MB each</p>
                <p class="text-xs text-gray-400 mt-1">You can select multiple files</p>
              </div>
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple
                class="hidden" 
                @change="uploadMultipleMedia($event.target.files)" 
              />
            </label>
            
            <!-- Upload Progress -->
            <div v-if="uploadingMedia" class="space-y-2">
              <div class="flex items-center gap-2 text-sm text-primary">
                <Icon name="heroicons-outline:refresh" class="h-4 w-4 animate-spin" />
                <span>Uploading {{ currentUploadIndex + 1 }} of {{ totalUploads }}...</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-primary h-2 rounded-full transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- URL Input -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Or paste media URL</label>
            <div class="flex gap-2">
              <input
                v-model="tempMediaUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                class="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              />
              <button
                v-if="tempMediaUrl"
                @click="addMediaFromUrl"
                class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Media List -->
          <div v-if="mediaItems.length > 0" class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-medium text-gray-700">Uploaded Media ({{ mediaItems.length }})</h4>
              <button
                @click="showMediaManager = false"
                class="text-sm text-primary hover:text-primary-600 font-medium"
              >
                Done
              </button>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div 
                v-for="media in sortedMedia" 
                :key="media.id"
                class="relative group"
              >
                <!-- Media Preview -->
                <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    v-if="media.type === 'image'"
                    :src="media.url" 
                    class="w-full h-full object-cover"
                  />
                  <div 
                    v-else
                    class="w-full h-full flex items-center justify-center bg-gray-800"
                  >
                    <Icon name="heroicons-outline:play" class="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 rounded-lg">
                  <button
                    @click="editMedia(media)"
                    class="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Edit"
                  >
                    <Icon name="heroicons-outline:pencil" class="w-4 h-4" />
                  </button>
                  <button
                    @click="moveMediaUp(media)"
                    :disabled="media.order_index === 0"
                    class="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <Icon name="heroicons-outline:arrow-up" class="w-4 h-4" />
                  </button>
                  <button
                    @click="moveMediaDown(media)"
                    :disabled="media.order_index === mediaItems.length - 1"
                    class="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <Icon name="heroicons-outline:arrow-down" class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteMedia(media.id)"
                    class="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                    title="Delete"
                  >
                    <Icon name="heroicons-outline:trash" class="w-4 h-4" />
                  </button>
                </div>
                
                <!-- Order Badge -->
                <div class="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  #{{ media.order_index + 1 }}
                </div>
                
                <!-- Visibility Badge -->
                <div v-if="!media.is_visible" class="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full">
                  <Icon name="heroicons-outline:eye-off" class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Media Modal -->
    <div v-if="editingMedia" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[110]" @click.self="closeMediaEditor">
      <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Edit Media</h3>
        
        <!-- Media Preview -->
        <div class="mb-4">
          <img 
            v-if="editingMedia.type === 'image'"
            :src="editingMedia.url" 
            class="w-full h-48 object-cover rounded-lg"
          />
          <div 
            v-else
            class="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center"
          >
            <Icon name="heroicons-outline:play" class="w-12 h-12 text-white" />
          </div>
        </div>

        <!-- Caption Title -->
        <AdminFormField
          v-model="editingMedia.alt_text[editorLanguage]"
          type="text"
          label="Title"
          placeholder="Main heading for this media"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
          class="mt-4"
        />
        
        <!-- Caption Description -->
        <AdminFormField
          v-model="editingMedia.caption[editorLanguage]"
          type="textarea"
          label="Description"
          :rows="3"
          placeholder="Detailed description or caption"
          :language-code="editorLanguage"
          :language-name="getCurrentLanguageName()"
        />

        <!-- Visibility -->
        <div class="mt-4 flex items-center gap-2">
          <input 
            v-model="editingMedia.is_visible"
            type="checkbox"
            id="media-visible"
            class="w-4 h-4 text-primary rounded"
          />
          <label for="media-visible" class="text-sm text-gray-700">
            Show this media on the website
          </label>
        </div>
        
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeMediaEditor"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveMediaEdit"
            class="px-4 py-2 bg-primary text-contrast1 rounded-lg hover:bg-primary-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ technologyId: String })
const { editorLanguage } = useEditorLanguage()
const { fetchSectionByKey, updateSection, createSection, getTranslation } = useTechnologies()
const { showError } = useErrorModal()
const { showSuccess } = useSuccessSnackbar()
const supabase = useSupabaseClient()

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' }
]

const layoutOptions = [
  { value: 'hero-overlay', label: 'Hero Overlay', icon: 'heroicons-outline:photograph' },
  { value: 'two-column', label: 'Two Column', icon: 'heroicons-outline:view-columns' },
  { value: 'grid', label: 'Grid', icon: 'heroicons-outline:view-grid' },
  { value: 'cards', label: 'Cards', icon: 'heroicons-outline:view-list' },
]

const editingField = ref(null)
const showColorPicker = ref(false)
const showLayoutPicker = ref(false)
const editData = ref({})
const showMediaManager = ref(false)
const editingMedia = ref(null)
const tempMediaUrl = ref('')
const uploadingMedia = ref(false)
const uploadProgress = ref(0)
const currentUploadIndex = ref(0)
const totalUploads = ref(0)
const mediaItems = ref([])
const currentSlide = ref(0)
const imagePosition = ref('left')

const sectionData = ref({
  technology_id: props.technologyId,
  section_key: 'tech_about',
  section_type: 'about',
  is_active: true,
  title_translations: { ar: '', en: '', fr: '' },
  content_translations: { ar: '', en: '', fr: '' },
  background_color: 'rgb(var(--primary-color))',
  text_color: 'rgb(var(--primary-contrast-color))',
  additional_data: { 
    gallery_layout: 'two-column',
    key_points: [],
    subtitle: { ar: '', en: '', fr: '' }
  }
})

const galleryLayout = computed({
  get: () => sectionData.value.additional_data?.gallery_layout || 'two-column',
  set: (val) => {
    if (!sectionData.value.additional_data) sectionData.value.additional_data = {}
    sectionData.value.additional_data.gallery_layout = val
    saveSection()
  }
})

const keyPoints = computed(() => sectionData.value.additional_data?.key_points || [])

const sortedMedia = computed(() => {
  return [...mediaItems.value].sort((a, b) => a.order_index - b.order_index)
})

const visibleMedia = computed(() => sortedMedia.value.filter(m => m.is_visible))

const currentTitle = computed(() => getTranslation(sectionData.value?.title_translations))
const currentContent = computed(() => getTranslation(sectionData.value?.content_translations))

const getCurrentLanguageName = () => languages.find(l => l.code === editorLanguage.value)?.name || ''

const getFieldName = () => {
  if (editingField.value === 'title') return 'Title'
  if (editingField.value === 'subtitle') return 'Subtitle'
  if (editingField.value === 'content') return 'Description'
  if (typeof editingField.value === 'number') return 'Key Point'
  return 'Field'
}

const mediaTitle = (media) => {
  if (media.alt_text) return getTranslation(media.alt_text)
  return ''
}

const mediaDescription = (media) => {
  if (media.caption) return getTranslation(media.caption)
  return ''
}

const loadData = async () => {
  if (!props.technologyId) return
  
  try {
    const { data } = await fetchSectionByKey(props.technologyId, 'tech_about')
    if (data) {
      if (!data.additional_data) {
        data.additional_data = { gallery_layout: 'two-column', key_points: [], subtitle: { ar: '', en: '', fr: '' } }
      }
      if (!data.additional_data.key_points) {
        data.additional_data.key_points = []
      }
      if (!data.additional_data.gallery_layout) {
        data.additional_data.gallery_layout = 'two-column'
      }
      if (!data.additional_data.subtitle) {
        data.additional_data.subtitle = { ar: '', en: '', fr: '' }
      }
      sectionData.value = { ...sectionData.value, ...data }
    }

    await loadMediaItems()
  } catch (error) {
    console.error('Error loading About section data:', error)
  }
}

const loadMediaItems = async () => {
  try {
    const { data, error } = await supabase
      .from('tech_about_media')
      .select('*')
      .eq('tech_id', props.technologyId)
      .order('order_index', { ascending: true })

    if (error) throw error
    mediaItems.value = data || []
  } catch (error) {
    console.error('Error loading media items:', error)
  }
}

const toggleVisibility = async () => {
  sectionData.value.is_active = !sectionData.value.is_active
  await saveSection()
}

const selectLayout = (layout) => {
  galleryLayout.value = layout
  showLayoutPicker.value = false
}

const applyColorScheme = (scheme) => {
  if (scheme === 'primary') {
    sectionData.value.background_color = 'rgb(var(--primary-color))'
    sectionData.value.text_color = 'rgb(var(--primary-contrast-color))'
  } else if (scheme === 'secondary') {
    sectionData.value.background_color = 'rgb(var(--secondary-color))'
    sectionData.value.text_color = 'rgb(var(--secondary-contrast-color))'
  } else if (scheme === 'body') {
    sectionData.value.background_color = 'rgb(var(--background-color))'
    sectionData.value.text_color = 'rgb(var(--text-color))'
  }
  showColorPicker.value = false
  saveSection()
}

const toggleImagePosition = () => {
  imagePosition.value = imagePosition.value === 'left' ? 'right' : 'left'
}

const openFieldEditor = (field) => {
  editingField.value = field
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
  if (!editData.value.additional_data) {
    editData.value.additional_data = { subtitle: { ar: '', en: '', fr: '' } }
  }
  if (!editData.value.additional_data.subtitle) {
    editData.value.additional_data.subtitle = { ar: '', en: '', fr: '' }
  }
}

const editKeyPoint = (index) => {
  editingField.value = index
  editData.value = JSON.parse(JSON.stringify(sectionData.value))
}

const closeFieldEditor = () => {
  editingField.value = null
  editData.value = {}
}

const saveField = async () => {
  sectionData.value = JSON.parse(JSON.stringify(editData.value))
  await saveSection()
  closeFieldEditor()
}

const saveSection = async (showNotification = true) => {
  try {
    if (sectionData.value.id) {
      await updateSection(sectionData.value.id, sectionData.value)
    } else {
      const { data } = await createSection(sectionData.value)
      if (data) sectionData.value.id = data.id
    }
    if (showNotification) {
      showSuccess('Saved successfully')
    }
  } catch (error) {
    console.error(error)
    showError('Failed to save')
  }
}

const addKeyPoint = () => {
  if (!sectionData.value.additional_data) sectionData.value.additional_data = {}
  if (!sectionData.value.additional_data.key_points) sectionData.value.additional_data.key_points = []
  
  sectionData.value.additional_data.key_points.push({
    text_translations: { ar: '', en: '', fr: '' }
  })
  
  editKeyPoint(sectionData.value.additional_data.key_points.length - 1)
}

const removeKeyPoint = (index) => {
  sectionData.value.additional_data.key_points.splice(index, 1)
  closeFieldEditor()
  saveSection()
}

const uploadMultipleMedia = async (files) => {
  if (!files || files.length === 0) return

  uploadingMedia.value = true
  totalUploads.value = files.length
  currentUploadIndex.value = 0

  for (let i = 0; i < files.length; i++) {
    currentUploadIndex.value = i
    await uploadSingleMedia(files[i])
    uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
  }

  uploadingMedia.value = false
  uploadProgress.value = 0
  await loadMediaItems()
  showSuccess(`${files.length} file(s) uploaded successfully`)
}

const uploadSingleMedia = async (file) => {
  if (!file) return

  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    showError('Please select an image or video file')
    return
  }
  
  if (file.size > 10 * 1024 * 1024) {
    showError('File must be less than 10MB')
    return
  }

  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${props.technologyId}/about-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `technologies/${fileName}`

    const { error: uploadError } = await supabase.storage.from('site').upload(filePath, file)
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('site').getPublicUrl(filePath)
    
    const maxOrder = mediaItems.value.length > 0 
      ? Math.max(...mediaItems.value.map(m => m.order_index))
      : -1

    const { error: dbError } = await supabase
      .from('tech_about_media')
      .insert({
        tech_id: props.technologyId,
        type: isImage ? 'image' : 'video',
        url: publicUrl,
        order_index: maxOrder + 1,
        caption: { en: '', fr: '', ar: '' },
        alt_text: { en: '', fr: '', ar: '' }
      })

    if (dbError) throw dbError

  } catch (error) {
    console.error(error)
    showError('Failed to upload file')
  }
}

const addMediaFromUrl = async () => {
  if (!tempMediaUrl.value) return

  try {
    const maxOrder = mediaItems.value.length > 0 
      ? Math.max(...mediaItems.value.map(m => m.order_index))
      : -1

    const { error } = await supabase
      .from('tech_about_media')
      .insert({
        tech_id: props.technologyId,
        type: 'image',
        url: tempMediaUrl.value,
        order_index: maxOrder + 1,
        caption: { en: '', fr: '', ar: '' },
        alt_text: { en: '', fr: '', ar: '' }
      })

    if (error) throw error

    await loadMediaItems()
    tempMediaUrl.value = ''
    showSuccess('Media added successfully')
  } catch (error) {
    console.error(error)
    showError('Failed to add media')
  }
}

const editMedia = (media) => {
  editingMedia.value = JSON.parse(JSON.stringify(media))
}

const closeMediaEditor = () => {
  editingMedia.value = null
}

const saveMediaEdit = async () => {
  try {
    const { error } = await supabase
      .from('tech_about_media')
      .update({
        caption: editingMedia.value.caption,
        alt_text: editingMedia.value.alt_text,
        is_visible: editingMedia.value.is_visible
      })
      .eq('id', editingMedia.value.id)

    if (error) throw error

    await loadMediaItems()
    closeMediaEditor()
    showSuccess('Media updated successfully')
  } catch (error) {
    console.error(error)
    showError('Failed to update media')
  }
}

const deleteMedia = async (mediaId) => {
  if (!confirm('Are you sure you want to delete this media?')) return

  try {
    const { error } = await supabase
      .from('tech_about_media')
      .delete()
      .eq('id', mediaId)

    if (error) throw error

    await loadMediaItems()
    showSuccess('Media deleted successfully')
  } catch (error) {
    console.error(error)
    showError('Failed to delete media')
  }
}

const moveMediaUp = async (media) => {
  if (media.order_index === 0) return

  const prevMedia = sortedMedia.value.find(m => m.order_index === media.order_index - 1)
  if (!prevMedia) return

  try {
    await supabase.from('tech_about_media').update({ order_index: media.order_index }).eq('id', prevMedia.id)
    await supabase.from('tech_about_media').update({ order_index: prevMedia.order_index }).eq('id', media.id)
    await loadMediaItems()
  } catch (error) {
    console.error(error)
    showError('Failed to reorder media')
  }
}

const moveMediaDown = async (media) => {
  if (media.order_index === mediaItems.value.length - 1) return

  const nextMedia = sortedMedia.value.find(m => m.order_index === media.order_index + 1)
  if (!nextMedia) return

  try {
    await supabase.from('tech_about_media').update({ order_index: media.order_index }).eq('id', nextMedia.id)
    await supabase.from('tech_about_media').update({ order_index: nextMedia.order_index }).eq('id', media.id)
    await loadMediaItems()
  } catch (error) {
    console.error(error)
    showError('Failed to reorder media')
  }
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? visibleMedia.value.length - 1 : currentSlide.value - 1
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % visibleMedia.value.length
}

onMounted(loadData)
watch(() => props.technologyId, loadData)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-primary-600 {
  color: rgb(var(--primary-color));
}
.bg-primary-600 {
  background-color: rgb(var(--primary-color));
}

h2,
h3 {
  text-wrap: balance;
}
</style>