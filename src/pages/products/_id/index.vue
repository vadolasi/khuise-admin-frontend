<template lang="pug">
div(class="w-full overflow-auto")
  DangerConfirmModal(v-model="deleteProductModal" title="Deletar produto" message="Tem certeza que deseja deletar este produto?" @confirm="deleteProduct")
  div(class="mx-auto my-5 w-4/5 lg:w-3/4 overfl.com/-fqow-auto")
    div(class="lg:grid lg:grid-cols-3")
      img(class="lg:col-span-2" src="http://1.bp.blogspot.com/-fqFfJ0hIsFg/Upf3_LfkOxI/AAAAAAADVjE/xgsbyJBjZN4/s1600/carros-rosa+(17).jpg")
      div(class="lg:m-4")
        input(
          type="text"
          v-if="editName"
          v-model="name"
          @blur="setName"
          @keyup.enter="setName"
          class="font-bold text-3xl text-gray-800 border border-pink-700 focus:outline-none rounded"
          v-focus
        )
        h2(v-else class="font-bold text-3xl text-gray-800") {{ name }}
          button(class="bg-transparent rounded-full hover:text-pink-700" @click="editName = true")
            span(class="material-icons align-middle") create
        textarea(
          v-if="editDescription"
          v-model="description"
          @blur="setDescription"
          @keyup.enter="setDescription"
          class="text-sm text-gray-700 border border-pink-700 focus:outline-none rounded my-3 w-full"
          v-focus
        )
        p(v-else v-model="description" class="text-sm text-gray-700 px-1 mr-1 my-3") {{ description }}
          button(class="bg-transparent rounded-full hover:text-pink-700" @click="editDescription = true")
            span(class="material-icons align-middle") create
        div(class="user flex items-center -ml-3 mt-2 mb-4")
          div(class="p-4")
            input(
              v-if="editPrice"
              class="text-3xl text-gray-900"
              v-model="price"
              v-mask="mask"
              v-focus
              @blur="setPrice"
              @keyup.enter="setPrice"
            )
            p(v-else class="text-3xl text-gray-900") R${{ price }}
              button(class="bg-transparent rounded-full hover:text-pink-700" @click="editPrice = true")
                span(class="material-icons align-middle") create
        button(class="w-full p-2 font-semibold text-center uppercase bg-pink-500 rounded text-white mt-3 focus:outline-none" @click="deleteProductModal = true")
          | Remover
    h2.mt-8.mb-4.text-2xl Estoque
      button(class="bg-transparent rounded-full hover:text-pink-700 focus:outline-none" @click="addingStock.push(true);stock.push({ node: { color: '', size: '', price: '' } })")
        span(class="material-icons align-middle") add
    table(class="w-full")
      thead(class="bg-pink-500 text-white")
        tr
          th(class="text-center py-3 px-4 uppercase font-semibold text-sm") Cor
          th(class="text-center py-3 px-4 uppercase font-semibold text-sm") Tamanho
          th(class="text-center py-3 px-4 uppercase font-semibold text-sm") Quantidade
          th(class="text-center py-3 px-4 uppercase font-semibold text-sm") Ações
      tbody(class="text-gray-700")
        tr(v-for="(productType, index) in stock" v-bind:key="productType.node.color + ' ' + productType.node.size")
          fragment(v-if="editStock[index] || addingStock[index]")
            td(class="text-center")
              input(v-model="productType.node.color" type="text" class="text-pink-700 text-center border rounded-lg focus:border-pink-500 focus:outline-none")
            td(class="text-center")
              input(v-model="productType.node.size" type="text" class="text-pink-700 text-center border rounded-lg focus:border-pink-500 focus:outline-none")
            td(class="text-center")
              input(v-model="productType.node.stock" type="number" class="text-pink-700 text-center border rounded-lg focus:border-pink-500 focus:outline-none")
          fragment(v-else)
            td(class="text-center py-3 px-4") {{ productType.node.color }}
            td(class="text-center py-3 px-4") {{ productType.node.size }}
            td(class="text-center py-3 px-4") {{ productType.node.stock }}
          DangerConfirmModal(v-model="deleteStockModal[index]" title="Deletar estoque" message="Tem certeza que deseja deletar este estoque?" @confirm="deleteStock(productType.node.pk, index)")
          td(class="py-3 px-4 flex justify-around")
            button(class="bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-if="editStock[index]" @click="setStock(productType.node.pk, index)")
              span(class="material-icons align-middle") check
            button(class="bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-else-if="addingStock[index]" @click="addStock(index)")
              span(class="material-icons align-middle") check
            button(class="bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-else @click="$set(editStock, index, true)")
              span(class="material-icons align-middle") create
            button(class="bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-if="addingStock[index]" @click="stock.splice(index, 1);addingStock.splice(index, 1)")
              span(class="material-icons align-middle") close
            button(class="bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-else @click="$set(deleteStockModal, index, true)")
              span(class="material-icons align-middle") delete
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
    title: productStore.name
  },
  async asyncData ({ route }) {
    if (productStore.pk == route.params.id) {
      var name = productStore.name
      var price = productStore.price

      const data = await this.$apollo.mutate({
        mutation: gql`
          query GetProduct(
            $id: ID!
          ) {
            product(id: $id) {
              description
              stock {
                edges {
                  node {
                    pk
                    color
                    size
                    stock
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: productStore.id
        }
      })

      var description = data.data.product.description
      var stock = data.data.product.stock.edges
      var stockLength = data.data.product.stock.edges.length
    } else {
      const data = await this.$apollo.mutate({
        mutation: gql`
          query GetProduct($id: ID!) {
            product(id: $id) {
              name
              description
              price
              images {
                edges {
                  node {
                    image
                  }
                }
              }
              stock {
                edges {
                  node {
                    color
                    size
                    stock
                  }
                }
              }
            }
          }
        `,
        variables: {
          id: productStore.pk
        }
      })

      const productResult = data.data.product
      var name = productResult.name
      var description = productResult.description
      var price = productResult.price
      var stock = productResult.stock.edges
      var stockLength = data.data.product.stock.edges.length
    }

    var deleteStockModal = []

    for (var i = 0; i < stockLength; i++) {
      deleteStockModal.push(false)
    }

    return {
      name: name,
      description: description,
      price: price,
      stock: stock,
      deleteStockModal: deleteStockModal,
      editStock: [...deleteStockModal],
      addingStock: [...deleteStockModal]
    }
  },

  data: {
    name: null,
    description: null,
    price: null,
    stockLength: null,
    editName: false,
    editDescription: false,
    editPrice: false,
    editStock: null,
    addingStock: null,
    deleteProductModal: false,
    deleteStockModal: null,
    mask: currencyMask
  },

  methods: {
    async addStock (index) {
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation AddStock(
            $color: String!
            $size: String!
            $stock: Int!
            $product: String!
          ) {
            addStock(
              input: {
                color: $color
                size: $size
                stock: $stock
                product: $product
              }
            ) {
              errors {
                field
                messages
              }
            }
          }
        `,
        variables: {
          color: this.stock[index].node.color,
          size: this.stock[index].node.size,
          stock: this.stock[index].node.stock,
          product: productStore.pk
        }
      })

      if (data.data.addStock.errors.length == 0) {
        this.$set(this.addingStock, index, false)
      }
    },

    async deleteProduct () {
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation RemoveProduct(
            $id: ID!
          ) {
            deleteProduct(id: $id) {
              errors {
                field
                messages
              }
            }
          }
        `,
        variables: {
          id: productStore.pk
        }
      })
    },

    async deleteStock (id, index) {
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation RemoveStock(
            $id: ID!
          ) {
            deleteStock(id: $id) {
              errors {
                field
                messages
              }
            }
          }
        `,
        variables: {
          id: id
        }
      })

      if (data.data.deleteStock.errors.length == 0) {
        this.stock.splice(index)
      }
    },

    async setName () {
      if (this.name !== productStore.name) {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation EditProduct(
              $id: ID!
              $name: String!
            ) {
              updateProduct(
                id: $id
                input: { name: $name }
              ) {
                errors {
                  field
                  messages
                }
              }
            }
          `,
          variables: {
            id: productStore.pk,
            name: this.name
          }
        })

        if (data.data.updateProduct.errors.length > 0) {
          this.name = productStore.name
        } else {
          productStore.setName(this.name)
        }
      }
      this.editName = false
    },

    async setDescription () {
      if (this.description !== productStore.description) {
        const data = await this.$apollo.mutate({
          mutation: gql`
            mutation EditProduct(
              $id: ID!
              $description: String!
            ) {
              updateProduct(
                id: $id
                input: { description: $description }
              ) {
                errors {
                  field
                  messages
                }
              }
            }
          `,
          variables: {
            id: productStore.pk,
            description: this.description
          }
        })

        if (data.data.updateProduct.errors.length > 0) {
          this.description = productStore.description
        }
      }
      this.editDescription = false
    },

    async setPrice () {
      if (this.price !== productStore.price) {
        const data = await authStore.makeRequest(
          {
            query: gql`
              mutation EditProduct(
                $id: ID!
                $price: Float!
              ) {
                updateProduct(
                  id: $id
                  input: { price: $price }
                ) {
                  errors {
                    field
                    messages
                  }
                }
              }
            `,
            variables: {
              id: productStore.pk,
              price: Number(this.price.replace(/[^\d,-]/g, '').replace(',', '.'))
            }
          }
        )

        if (data.data.updateProduct.errors.length > 0) {
          this.price = productStore.price
        } else {
          this.price = this.price.replace(/[^\d,-]/g, '')
          productStore.setPrice(this.price.replace(/[^\d,-]/g, '').replace(',', '.'))
        }
      }
      this.editPrice = false
    },

    async setStock (id, index) {
      const data = await authStore.makeRequest(
        {
          query: gql`
            mutation EditStock(
              $id: ID!
              $color: String!
              $size: String!
              $stock: Int!
            ) {
              updateStock(
                id: $id
                input: {
                  color: $color
                  size: $size
                  stock: $stock
                }
              ) {
                errors {
                  field
                  messages
                }
              }
            }
          `,
          variables: {
            id: id,
            color: this.stock[index].node.color,
            size: this.stock[index].node.size,
            stock: this.stock[index].node.stock
          }
        }
      )

      if (data.data.updateStock.errors.length > 0) {
        this.name = productStore.name
      } else {
        productStore.setStock(this.stock)
      }
      this.$set(this.editStock, index, false)
    }
  }
}
</script>

