<template lang="pug">
div(class="col-span-2")
  div(class="grid grid-cols-5 gap-2")
    div(class="overflow-y-auto")
      button(v-for="(image, index) in imagesUrls" class="w-full mb-1 border border-pink-500 hover:border-pink-700" :class="(selectedImage == index) ? 'border-pink-500' : ''" :key="image" @click="selectedImage = index; addImage = false")
        img(:src="image" class="object-contain")
      button(class="w-full h-10 border border-pink-500 hover:border-pink-700" @click="addImage = true")
        | Adicionar
    div(class="col-span-4")
      picture-input(
        @change="changeImage"
        @remove="removeImage"
        :prefill="(addImage) ? '' : imageUrl"
        :removable="true"
        :crop="false"
        zIndex="0"
        :customStrings="pictureInputStrings"
        buttonClass="transition duration-200 ease-in-out p-1 text-white rounded-md text-sm bg-pink-500 hover:bg-pink-700 font-bold" 
        removeButtonClass="transition duration-200 ease-in-out p-1 rounded-md text-sm text-pink-500 border border-pink-500 bg-tranparent font-bold hover:bg-pink-200"
      )
</template>

<script>
import gql from "graphql-tag"

export default {
  data () {
    return {
      pictureInputStrings: {
        upload: '<h1>Carregar</h1>',
        drag: 'Selecione uma imagem ou solte-a aqui',
        change: 'Mudar imagem',
        select: 'Seleconar imagem',
        remove: 'Remover imagem',
        selected: '<p>Imagem carregada com sucesso!</p>'
      },
      selectedImage: 0,
      addImage: false
    }
  },
  computed: {
    imagesUrls () {
      return this.$store.state.product.images.map(
        (image) => {
          return `https://dpkidwvuicjfi.cloudfront.net/media/${image.node.image}`
        }
      )
    },
    imageUrl () {
       return `${process.env.BACKEND || "https://khuise-shop-6598.herokuapp.com"}/image?image=${this.$store.state.product.images[this.selectedImage].node.image}`
    }
  },
  methods: {
    async changeImage(image) {
      if (this.addImage) {
        const { data: { addImage: imageData } } = await this.$apollo.mutate({
          mutation: gql`
            mutation AddImage(
              $product: ID!
              $image: String!
            ) {
              addImage(input: {
                product: $product
                image: $image
              }) {
               image {
                  id
                  image
                }
              }
            }
          `,
          variables: {
            product: this.$store.state.product.id,
            image: image
          }
        })
        this.$store.commit("product/addImage", imageData.image.id, imageData.image.image)
        this.addImage = false
        this.selectedImage - this.$store.state.product.images.length
      } else {
        await this.$apollo.mutate({
          mutation: gql`
            mutation UpdateImage(
              $id: ID!
              $product: ID!
              $image: String!
            ) {
              updateImage(
                id: $id
                input: {
                	product: $product
                	image: $image
              	}
              ) {
               image {
                  id
                  image
                }
              }
            }
          `,
          variables: {
            id: this.$store.state.product.images[this.selectedImage].node.id,
            product: this.$store.state.product.id,
            image: image
          }
        })
        this.$forceUpdate()
      }
    },
    async removeImage() {
      if (!this.addImage) {
        await this.$apollo.mutate({
          mutation: gql`
            mutation RemoveImage(
              $id: ID!
            ) {
              deleteImage(id: $id) {
                found
              }
            }
          `,
          variables: {
            id: this.$store.state.product.images[this.selectedImage].node.id
          }          
        })
        this.$store.commit("product/removeImage", this.selectedImage)
        if (this.selectedImage !== 0) {
          this.selectedImage -= 1
        }
      }
    }
  }
}
</script>
