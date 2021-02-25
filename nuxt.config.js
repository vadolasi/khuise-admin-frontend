const DefaultApolloOptions = {
    httpEndpoint: process.env.BACKEND_ENDPOINT || "https://khuise-shop-6598.herokuapp.com/graphql-web/",
    httpLinkOptions: {
    credentials: "include"
  }
}

export default {
  srcDir: "src",

  head: {
    title: "Administração Khuise",
    htmlAttrs: {
      lang: "pt-br"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },

  css: [],

  plugins: [
    {
      src: "plugins/fragment"
    },
    {
      src: "plugins/imageUpload",
      mode: "client"
    },
    {
      src: "plugins/mask",
      mode: "client"
    }
  ],

  components: true,

  router: {
    middleware: ["isAuthenticated"]
  },

  buildModules: [
    "@aceforth/nuxt-optimized-images",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/pwa"
  ],

  optimizedImages: {
    optimizeImages: true
  },
 
  pwa: {
    manifest: {
      lang: "pt-br"
    }
  },

  modules: [
    "@luxdamore/nuxt-prune-html",
    "@nuxtjs/apollo",
    "@nuxtjs/dotenv",
    "nuxt-material-design-icons"
  ],

  apollo: {
    clientConfigs: {
      default: DefaultApolloOptions,
      products: DefaultApolloOptions,
      product: DefaultApolloOptions
    }
  },

  build: {}
}

