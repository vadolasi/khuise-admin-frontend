<template lang="pug">
div(class="col-span-2")
  div(class="grid grid-cols-5 gap-2")
    div(class="overflow-y-auto")
      div(v-for="(image, index) in imagesUrls" class="mb-1 border border-pink-500 hover:border-pink-700" :class="(selectedImage == index) ? 'border-pink-500' : ''" :key="image")
        img(:src="image" class="object-contain")
      button(class="w-full h-10 border border-pink-500 hover:border-pink-700" @click="addImage = true")
    div(class="col-span-4")
      picture-input(
        @change="changeImage"
        @remove="removeImage"
        :prefill="(addImage) ? '' : imageUrl"
        :removable="true"
        accept="image/jpeg,image/png"
        :crop="false"
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
          return "https://dev-khuise-app.s3-sa-east-1.amazonaws.com/media/" + image.node.image
        }
      )
    },
    imageUrl () {
      return "https://dev-khuise-app.s3-sa-east-1.amazonaws.com/media/" + this.$store.state.product.images[this.selectedImage].node.image
    }
  },
  methods: {
    async addImage(image) {
      
    },
    async removeImage() {
      const { data: { deleteImage: imageData } } = await this.$apollo.mutate({
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
    }
  }
}
</script>

