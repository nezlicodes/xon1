<template>
  <a
    v-if="href"
    :href="href"
    class="flex items-center group transition-all duration-300 ease-in-out"
    :aria-label="label"
  >
    <div
      class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border  mr-4 group-hover:scale-105 transition-transform"
    >
      <component
        :is="getIcon"
        class="h-4 w-4 group-hover:scale-110 transition-transform"
        aria-hidden="true"
      />
    </div>
    <span
      class="font-light group-hover:underline transition-all"
      >{{ text }}</span
    >
  </a>

  <div v-else class="flex items-start">
    <div
      class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border  mr-4 mt-1"
    >
      <component
        :is="getIcon"
        class="h-4 w-4"
        aria-hidden="true"
      />
    </div>
    <span class="font-light">{{ text }}</span>
  </div>
</template>


<script setup>
import { computed } from "vue";

const props = defineProps({
  href: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ["phone", "email", "address"].includes(value),
  },
  label: {
    type: String,
    default: "",
  },
});

// Return the appropriate icon component based on type
const getIcon = computed(() => {
  switch (props.type) {
    case "phone":
      return PhoneIcon;
    case "email":
      return EmailIcon;
    case "address":
      return AddressIcon;
    default:
      return null;
  }
});

// Icon components
const PhoneIcon = {
  render() {
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
        }),
      ]
    );
  },
};

const EmailIcon = {
  render() {
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        }),
      ]
    );
  },
};

const AddressIcon = {
  render() {
    return h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        stroke: "currentColor",
      },
      [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
        }),
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z",
        }),
      ]
    );
  },
};
</script>