<template lang="pug">
div(class="m-3 bg-white shadow-lg rounded" @click="openProduct")
  div
    img(v-show="isLoaded" :src="'https://dev-khuise-app.s3-sa-east-1.amazonaws.com/media/' + this.product.images.edges[0].node.image" @load="isLoaded = true")
  div(v-if="!isLoaded" class="animate-pulse ';'w-full h-48 bg-pink-400")
  div(class="p-1")
    label(class="flex flex-col group relative p-2")
      div(class="w-full rounded-t-lg")
        p(style="hyphens: auto" class="text-3xl lg:text-2xl font-bold text-left text-pink-500") {{ product.name }}
      div(class="w-full rounded-t-lg")
        p(class="text-2xl lg:text-xl font-bold text-left rounded text-gray-800") R$ {{ product.price }}
</template>

<script>
export default {
  name: "Product",

  props: {
    product: {
      type: Object,
      required: true
    }
  },

  data: {
    isLoaded: false,
  },

  methods: {
    openProduct () {
      this.$store.commit("product/setId", this.product.id)
      this.$store.commit("product/setName", this.product.name)
      this.$store.commit("product/setPrice", this.product.price)
      this.$router.push(`/products/${this.product.id}`)
    }
  }
}
</script>

