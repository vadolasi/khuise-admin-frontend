<template lang="pug">
fragment
  div(class="w-full overflow-auto")
    div(class="mx-auto w-1/2 my-5")
      h2(class="text-xl font-bold text-pink-600 mb-5") Informações
      label(class="text-gray-700") Nome
      input(v-model="name" type="text" class="w-full my-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="text-gray-700") Descrição
      textarea(v-model="description" class="w-full my-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="text-gray-700") Preço
      input(v-model="price" type="text" v-mask="mask" class="w-full mt-2 mb-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      h2(class="text-xl font-bold text-pink-600 my-5") Estoque
      div(class="grid grid-cols-4 gap-4 mb-5" v-if="stock.length > 0")
        fragment(v-for="(productType, index) in stock" v-bind:key="index")
          Input(v-model="stock[index].size" placeholder="Tamanho")
          Input(v-model="stock[index].color" placeholder="Cor")
          Input(v-model="stock[index].stock" type="number" placeholder="Quantidade")
          button(class="bg-pink-500 hover:bg-pink-700 text-white py-1 px-3 font-bold rounded" @click="stock.splice(index, 1)") Remover
      button(class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded" @click='stock.push({size: "", color: "", stock: null})') Adicionar
      h2(class="text-xl font-bold text-pink-600 my-5") Imagens
      div(class="grid grid-cols-2 gap-4")
        fragment(v-for="(image, index) in images" v-bind:key="index")
          picture-input(:ref="'image' + index" :customStrings="{ upload: '<h1>Carregar</h1>', drag: 'Selecione uma imagem ou solte-a aqui'}")
          button(class="bg-pink-500 hover:bg-pink-700 text-white py-1 px-3 font-bold rounded" @click="images.splice(index, 1)") Remover
      button(class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded" @click='images.push("")') Adicionar
      div(class="grid grid-cols-2 gap-2 mt-10")
        button(class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded" @click="save") Adicionar
        button(class="bg-trasparent border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white font-bold py-2 px-4 rounded" @click="$router.push('/products')") Cancelar
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

      this.$store.commit("product/setId", productData.product.id)
      this.$store.commit("product/setName", this.name)
      this.$store.commit("product/setPrice", parseFloat(this.price.replace(/[^\d.-]/g, '').replace(',', '.')))
      this.$store.commit("product/setStock", this.stock.map((productType) => {
        return { node: productType }
      }))
      this.$apollo.provider.clients.products.cache.data.clear()
      this.$router.push(`/products/${productData.product.id}`)
    }
  }
}
</script>

