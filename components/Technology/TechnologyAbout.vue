<template>
  <section
    v-if="section"
    class="relative overflow-hidden"
    :dir="isRtl ? 'rtl' : 'ltr'"
    :style="{
      backgroundColor: section.background_color || 'transparent',
      color: section.text_color || '#1a1a1a',
    }"
  >
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
        <NuxtImg
          v-else
          :src="visibleMedia[0]?.url"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/50"></div>
      </div>
      <div class="relative z-10 w-full px-6 max-w-7xl mx-auto">
        <p
          v-if="section.additional_data?.subtitle"
          class="text-lg lg:text-xl mb-6 opacity-90 font-medium tracking-wide text-white"
        >
          {{ getTranslation(section.additional_data.subtitle) }}
        </p>
        <h2
          class="text-5xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-white"
        >
          {{ currentTitle }}
        </h2>
        <p
          class="text-xl lg:text-2xl font-light opacity-90 max-w-2xl leading-relaxed text-white"
        >
          {{ currentContent }}
        </p>
        <div
          v-if="section.additional_data?.key_points?.length"
          class="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl"
        >
          <div
            v-for="(point, index) in section.additional_data.key_points"
            :key="index"
            class="flex items-center gap-3 backdrop-blur-md rounded-xl p-4 border border-white/20"
          >
            <Icon
              name="heroicons-outline:check-circle"
              class="h-6 w-6 text-green-600"
            />
            <span class="font-medium text-white">{{
              getTranslation(point.text_translations)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="py-16 lg:py-32 px-6">
      <div class="max-w-7xl mx-auto">
        <div
          v-if="
            !['hero-overlay', 'two-column'].includes(galleryLayout) &&
            (currentTitle || currentContent)
          "
          class="mb-20"
        >
          <p
            v-if="section.additional_data?.subtitle"
            class="font-bold tracking-widest uppercase text-sm mb-4"
          >
            {{ getTranslation(section.additional_data.subtitle) }}
          </p>
          <h2
            class="text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] mb-8"
          >
            {{ currentTitle }}
          </h2>
          <p
            v-if="currentContent"
            class="text-xl lg:text-2xl max-w-3xl leading-relaxed mb-10"
          >
            {{ currentContent }}
          </p>
          <div
            v-if="section.additional_data?.key_points?.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div
              v-for="(point, index) in section.additional_data.key_points"
              :key="index"
              class="flex items-center gap-3 rounded-xl p-4"
            >
              <Icon
                name="heroicons-outline:check-circle"
                class="h-6 w-6 text-green-600"
              />
              <span class="font-medium">{{
                getTranslation(point.text_translations)
              }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="galleryLayout === 'two-column'"
          :class="isRtl ? 'lg:flex-row-reverse' : 'lg:flex-row'"
          class="flex flex-col lg:gap-24 items-center"
        >
          <div class="flex-1 lg:max-w-2xl">
            <h2
              v-if="currentTitle"
              class="text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.1] mb-8"
            >
              {{ currentTitle }}
            </h2>
            <p v-if="currentContent" class="text-xl leading-relaxed mb-10">
              {{ currentContent }}
            </p>
            <div
              v-if="section.additional_data?.key_points?.length"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div
                v-for="(point, index) in section.additional_data.key_points"
                :key="index"
                class="flex items-center gap-3 rounded-xl p-4 border"
              >
                <Icon
                  name="heroicons-outline:check-circle"
                  class="h-6 w-6 text-green-600"
                />
                <span class="font-medium">{{
                  getTranslation(point.text_translations)
                }}</span>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full mt-12 lg:mt-0">
            <div
              class="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-video lg:aspect-square"
            >
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
                  <NuxtImg
                    v-else
                    :src="visibleMedia[currentSlide]?.url"
                    class="w-full h-full object-cover"
                  />
                </div>
              </transition>
              <div class="absolute bottom-6 right-6 flex gap-2">
                <button
                  @click="prevSlide"
                  class=" p-3 rounded-full shadow-lg transition-all"
                >
                  <Icon name="heroicons-outline:chevron-left" class="w-6 h-6" />
                </button>
                <button
                  @click="nextSlide"
                  class="p-3 rounded-full shadow-lg transition-all"
                >
                  <Icon
                    name="heroicons-outline:chevron-right"
                    class="w-6 h-6"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="galleryLayout === 'grid'"
          class="flex flex-col gap-16 lg:gap-24"
        >
          <div
            v-for="media in visibleMedia"
            :key="media.id"
            class="group w-full  rounded-[2rem] lg:rounded-[3.5rem] overflow-hidden shadow-sm border border-slate-100"
          >
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
              <NuxtImg v-else :src="media.url" class="w-full h-auto block" />
            </div>
            <div
              v-if="mediaTitle(media) || mediaDescription(media)"
              class="p-8 lg:p-16"
            >
              <div class="max-w-4xl">
                <h3 class="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">
                  {{ mediaTitle(media) }}
                </h3>
                <p class="text-xl lg:text-2xl leading-relaxed font-light">
                  {{ mediaDescription(media) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else-if="galleryLayout === 'cards'"
          class="flex flex-col gap-24 lg:gap-40"
        >
          <div
            v-for="(media, index) in visibleMedia"
            :key="media.id"
            class="flex flex-col lg:flex-row w-full items-center"
            :class="[
              mediaRowClass(index),
              isRtl ? 'lg:flex-row-reverse' : 'lg:flex-row',
            ]"
          >
            <div class="w-full lg:w-max flex-shrink">
              <div
                class="relative overflow-hidden rounded-[1.5rem] lg:rounded-[2.5rem] shadow-sm bg-black"
              >
                <video
                  v-if="media.type === 'video'"
                  :src="media.url"
                  class="block w-full h-auto max-h-[75vh] lg:w-auto"
                  autoplay
                  loop
                  muted
                  playsinline
                />
                <NuxtImg
                  v-else
                  :src="media.url"
                  class="block w-full h-auto max-h-[75vh] lg:w-auto"
                />
              </div>
            </div>
            <div
              class="flex-1 min-w-[25%] lg:min-w-[300px]"
              :class="[
                index % 2 === 0
                  ? isRtl
                    ? 'lg:pr-12 xl:pr-20'
                    : 'lg:pl-12 xl:pl-20'
                  : isRtl
                  ? 'lg:pl-12 xl:pr-20'
                  : 'lg:pr-12 xl:pr-20',
              ]"
            >
              <div class="py-10 lg:py-4">
            
                <h3
                  v-if="mediaTitle(media)"
                  class="text-3xl lg:text-5xl font-bold mb-6 leading-tight tracking-tighter"
                >
                  {{ mediaTitle(media) }}
                </h3>
                <p
                  v-if="mediaDescription(media)"
                  class="text-lg lg:text-xl leading-relaxed font-light "
                >
                  {{ mediaDescription(media) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  section: Object,
  technologyId: String,
});

const { getTranslation } = useTechnologies();
const { locale } = useI18n();
const supabase = useSupabaseClient();

const isRtl = computed(() => ["ar", "he", "fa", "ur"].includes(locale.value));

const currentTitle = computed(() =>
  getTranslation(props.section?.title_translations)
);
const currentContent = computed(() =>
  getTranslation(props.section?.content_translations)
);
const galleryLayout = computed(
  () => props.section?.additional_data?.gallery_layout || "cards"
);

const mediaItems = ref([]);
const currentSlide = ref(0);

const loadMedia = async () => {
  if (!props.technologyId) return;
  try {
    const { data, error } = await supabase
      .from("tech_about_media")
      .select("*")
      .eq("tech_id", props.technologyId)
      .eq("is_visible", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    mediaItems.value = data || [];
  } catch (error) {
    console.error("Error loading media:", error);
  }
};

const visibleMedia = computed(() =>
  mediaItems.value.filter((m) => m.is_visible)
);

const pickLocalized = (map) => {
  if (!map) return "";
  const l = locale?.value || "en";
  const byLocale = typeof map[l] === 'string' ? map[l].trim() : '';
  if (byLocale) return byLocale;
  const byEn = typeof map['en'] === 'string' ? map['en'].trim() : '';
  if (byEn) return byEn;
  const first = Object.values(map).find((v) => typeof v === 'string' && v.trim().length > 0);
  return first || "";
};

const mediaTitle = (media) => {
  if (media?.caption_title) return getTranslation(media.caption_title);
  return pickLocalized(media?.alt_text);
};

const mediaDescription = (media) => {
  if (media?.caption_description) return getTranslation(media.caption_description);
  return pickLocalized(media?.caption);
};

const mediaRowClass = (index) => {
  const isEven = index % 2 === 0;
  // Always use row-reverse for odd items in LTR.
  // In RTL, Tailwind's flex-row already starts from the right, so we just toggle reverse logic.
  if (isRtl.value) {
    return isEven ? "lg:flex-row" : "lg:flex-row-reverse";
  }
  return isEven ? "lg:flex-row" : "lg:flex-row-reverse";
};

onMounted(() => loadMedia());
watch(() => props.technologyId, loadMedia);

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % visibleMedia.value.length;
}
function prevSlide() {
  currentSlide.value =
    (currentSlide.value - 1 + visibleMedia.value.length) %
    visibleMedia.value.length;
}
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


.bg-primary-600 {
  background-color: rgb(var(--primary-color));
}

/* Standardizes typography for professional feel */
h2,
h3 {
  text-wrap: balance;
}
</style>