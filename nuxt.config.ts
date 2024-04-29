// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["~/assets/styles/tailwind.css"],
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "@vueuse/nuxt"],
  components: [{ path: "~/components" }, { path: "~/components/pages" }, { path: "~/components/common" }],
  imports: {
    dirs: ["composables/**/**.ts"],
  },
  ui: {
    icons: ["heroicons", "tabler"],
  },
  supabase: {
    redirectOptions: {
      login: "/auth/login",
      callback: "/auth/callback",
      exclude: ["/"],
    },
  },
  app: {
    head: {
      htmlAttrs: {
        class: "h-full",
      },
      bodyAttrs: {
        class: "h-full",
      },
      charset: "utf-8",
      title: "Kadl",
      titleTemplate: "%s | Kadl",
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Kadl" },
        { property: "og:description", content: "Kadl" },
      ],
    },
  },
  ssr: false,
});
