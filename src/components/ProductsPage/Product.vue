<template lang="pug">
div(class="m-3 bg-white shadow-lg rounded" @click="openProduct")
  div
    img(:src="imageURL" class="rounded-t")
  div(class="p-1")
    label(class="flex flex-col group relative p-2")
      div(class="w-full rounded-t-lg")
        p(class="text-3xl lg:text-2xl font-bold text-left text-pink-500") {{ product.name }}
      div(class="w-full rounded-t-lg")
        p(class="text-2xl lg:text-xl font-bold text-left rounded text-gray-800") R$ {{ product.price }}
</template>

<script>
export default {
  props: ["product"],

  computed: {
    imgaeURL: function () {
      if (this.product.images.edges.length > 0) {
        return "https://dev-khuise-app.s3-sa-east-1.amazonaws.com/media/" + this.product.images.edges[0].node.imageURL
      }
      return ""
    }
  },

  methods: {
    openProduct () {
      productStore.setId(this.product.id)
      productStore.setPk(this.product.pk)
      productStore.setName(this.product.name)
      productStore.setPrice(this.product.price)
      this.$router.push(`/products/${this.product.pk}`)
    }
  }
}
</script>

