<template lang="pug">
picture-input(
  @change="changeImage(index, ...arguments)"
  @remove="removeImage(index)"
  :prefill="imageUrl"
  :removable="true"
  :customStrings="pictureInputStrings"
  buttonClass="transition duration-200 ease-in-out p-1 text-white rounded-md text-sm bg-pink-500 hover:bg-pink-700 font-bold" 
  removeButtonClass="transition duration-200 ease-in-out p-1 rounded-md text-sm text-pink-500 border border-pink-500 bg-tranparent font-bold hover:bg-pink-200"
  radius="10"
)
</template>

<script>
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
      selectedImage: 0    
    }
  },
  computed: {
    imageUrl () {
      return "https://dev-khuise-app.s3-sa-east-1.amazonaws.com/media/" + this.$store.state.product.images[this.selectedImage].node.image
    }
  }
}
</script>

