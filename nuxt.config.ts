// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: {enabled: true},
  app: {
    head: {
      title: "album viewer or whatever",
      link: [{rel: "icon", type: "image/png", href: "/img/logo.jpg"}]
    }
  },
  css: ["~/public/css/style.css"],
  modules: ["@nuxtjs/tailwindcss", "nuxt-headlessui", "nuxt-headlessui"],
  headlessui: {
    prefix: ""
  }
});
