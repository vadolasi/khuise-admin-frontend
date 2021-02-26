<template lang="pug">
fragment
  div(class="w-full overflow-auto")
    div(class="mx-auto w-4/5 lg:w-1/2 my-5")
      h2(class="text-xl font-bold text-pink-600 mb-5") Informações
      label(class="text-gray-700") Nome
      input(v-model="name" type="text" class="w-full my-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="text-gray-700") Descrição
      textarea(v-model="description" class="w-full my-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="text-gray-700") Preço
      input(v-model="price" type="text" v-mask="mask" class="w-full mt-2 mb-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      h2(class="text-xl font-bold text-pink-600 my-5") Estoque
      div(class="grid grid-cols-4 gap-4 mb-5" v-if="stock.length > 0")
        fragment(v-for="(productType, index) in stock" :key="index")
          Input(v-model="stock[index].size" placeholder="Tamanho")
          Input(v-model="stock[index].color" placeholder="Cor")
          Input(v-model="stock[index].stock" type="number" placeholder="Quantidade")
          button(class="bg-pink-500 hover:bg-pink-700 text-white py-1 px-3 font-bold rounded" @click="stock.splice(index, 1)") Remover
      button(class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded" @click='stock.push({size: "", color: "", stock: null})') Adicionar
      h2(class="text-xl font-bold text-pink-600 my-5") Imagens
      div(class="grid grid-cols-1 lg:grid-cols-2 gap-4")
        div(v-for="(image, index) in images" :key="image")
          picture-input(
            @change="changeImage(index, ...arguments)"
            @remove="removeImage(index)"
            :prefill="image"
            :removable="true"
            :crop="false"
            zIndex="0"
            :customStrings="pictureInputStrings"
            buttonClass="transition duration-200 ease-in-out p-1 text-white rounded-md text-sm bg-pink-500 hover:bg-pink-700 font-bold" 
            removeButtonClass="transition duration-200 ease-in-out p-1 rounded-md text-sm text-pink-500 border border-pink-500 bg-tranparent font-bold hover:bg-pink-200"
            radius="10"
          )
        button(v-if="images[images.length - 1] || images.length == 0" class="transition duration-200 ease-in-out bg-transparent border border-pink-500 hover:bg-pink-300" style="border-radius: 10%" @click='images.push("")') adicionar
      div(class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10")
        button(class="transition duration-200 ease-in-out bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded" @click="save") Adicionar
        button(class="transition duration-200 ease-in-out bg-trasparent border border-pink-600 text-pink-600 hover:bg-pink-300 font-bold py-2 px-4 rounded" @click="$router.push('/products')") Cancelar
</template>

<script>
import gql from "graphql-tag"
import createNumberMask from "text-mask-addons/dist/createNumberMask"

const currencyMask = createNumberMask({
  prefix: "R$",
  allowDecimal: true,
  thousandsSeparatorSymbol: ".",
  decimalSymbol: ",",
  includeThousandsSeparator: true,
  allowNegative: false,
})

export default {
  head: {
    title: "Adicionar produto"
  },
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
      mask: currencyMask,
      name: "",
      description: "",
      price: "",
      categories: [],
      stock: [],
      images: []
    }
  },
  methods: {
    async save () {
      const { data: { addProduct: productData  } } = await this.$apollo.mutate({
        mutation: gql`
          mutation addProduct(
            $name: String!
            $description: String!
            $price: Float!
          ) {
            addProduct(input: {
              name: $name
              description: $description
              price: $price
            }) {
              product {
                id
              }
            }
          }
        `,
        variables: {
          name: this.name,
          description: this.description,
          price: this.price.replace(/[^\d.-]/g, '').replace(',', '.'),
        }
      })

      console.log(this.stock.map(
            (productType) => {
              return { product: productData.product.id, stock: Number(productType.stock), ...productType }
            }
          )
        )

      const { data: { addStock: stockData  }  } = await this.$apollo.mutate({
        mutation: gql`
          mutation AddStock(
            $stock: [BatchCreateStockInput]!
          ) {
            addStock(input: $stock) {
	            stocks {
                id
	            }
            }
          }
        `,
        variables: {
          stock: this.stock.map(
            (productType) => {
              return { product: productData.product.id, stock: parseInt(productType.stock), ...productType }
            }
          )
        }
      })

      if (!this.images[this.images.length - 1]) {
        this.images.splice(this.images.length - 1, 1)
      }

      console.log(this.images.map((image) => {
          return { 
            product: productData.product.id,
            image: image
          }
        })
      )

      const { data: { addImages: imagesData  }  } = await this.$apollo.mutate({
        mutation: gql`
          mutation AddImages(
            $images: [BatchCreateImageInput]!
          ) {
            addImages(input: $images) {
	            images {
                id
                image
	            }
            }
          }
        `,
        variables: {
          images: this.images.map((image) => {
            return { 
              product: productData.product.id,
              image: image
            }
          })
        }
      })

      this.$store.commit("product/setId", productData.product.id)
      this.$store.commit("product/setName", this.name)
      this.$store.commit("product/setPrice", parseFloat(this.price.replace(/[^\d.-]/g, '').replace(',', '.')))
      this.$store.commit("product/setStock", this.stock.map((productType) => {
        return { node: productType }
      }))
      this.$store.commit("product/setImages", imagesData.images.map((image) => {
        return { node: image }
      }))
      this.$apollo.provider.clients.products.cache.data.clear()
      this.$router.push(`/products/${productData.product.id}`)
    },
    changeImage (index, image) {
      this.$set(this.images, index, image)
    },
    removeImage (index) {
      if (index !== this.images.length - 1) {
        this.images.splice(index, 1)
      } else {
        this.$set(this.images, index, "")
      }
    }
  }
}
</script>

