<template lang="pug">
div(class="lg:m-4")
        DangerConfirmModal(v-model="deleteProductModal" title="Deletar produto" message="Tem certeza que deseja deletar este produto?" @confirm="deleteProduct")
        input(
          type="text"
          v-if="editName"
          v-model="name"
          @blur="setName"
          @keyup.enter="setName"
          class="w-full font-bold text-3xl text-gray-800 border border-pink-500 focus:outline-none rounded"
          v-focus
        )
        h2(v-else class="font-bold text-3xl text-gray-800") {{ name }}
          button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700" @click="editName = true")
            span(class="material-icons align-middle") create
        textarea(
          v-if="editDescription"
          v-model="description"
          @blur="setDescription"
          @keyup.enter="setDescription"
          class="text-sm text-gray-700 border border-pink-500 focus:outline-none rounded my-3 w-full"
          v-focus
        )
        p(v-else v-model="description" class="text-sm text-gray-700 px-1 mr-1 my-3") {{ description }}
          button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700" @click="editDescription = true")
            span(class="material-icons align-middle") create
        div(class="user flex items-center -ml-3 mt-2 mb-4")
          div(class="p-4")
            input(
              v-if="editPrice"
              class="w-full border border-pink-500 rounded text-3xl text-gray-900 focus:outline-none"
              v-model="price"
              v-mask="mask"
              v-focus
              @blur="setPrice"
              @keyup.enter="setPrice"
            )
            p(v-else class="text-3xl text-gray-900") R${{ price }}
              button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700" @click="editPrice = true")
                span(class="material-icons align-middle") create
        button(class="transition duration-200 ease-in-out font-semibold w-full p-2 text-center uppercase bg-pink-500 rounded text-white mt-3 focus:outline-none hover:bg-pink-700" @click="deleteProductModal = true")
          | Remover
</template>

<script>
import gql from "graphql-tag"

export default {
  data () {
    return {
      name: this.$store.state.product.name,
      description: this.$store.state.product.description,
      price: this.$store.state.product.price,
      editName: false,
      editDescription: false,
      editPrice: false,
      deleteProductModal: false
    }
  },
  methods: {
    async deleteProduct () {
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation RemoveProduct(
            $id: ID!
          ) {
            deleteProduct(id: $id) {
              found
            }
          }
        `,
        variables: {
          id: this.$store.state.product.id
        }
      })
      this.$apollo.provider.clients.products.cache.data.clear()
      this.$router.push("/products")
    },
 
    async setName () {
      if (this.name !== this.$store.state.product.name) {
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
                product {
                  id
                }
              }
            }
          `,
          variables: {
            id: this.$store.state.product.id,
            name: this.name
          }
        })
        this.$apollo.provider.clients.products.cache.data.clear()
        this.$store.commit("product/setName", this.name)
      }
      this.editName = false
    },

    async setDescription () {
      if (this.description !== this.$store.state.product.description) {
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
                product {
                  id
                }
              }
            }
          `,
          variables: {
            id: this.$store.state.product.id,
            description: this.description
          }
        })
      }
      this.$apollo.provider.clients.product.cache.data.clear()
      this.editDescription = false
    },

    async setPrice () {
      if (this.price !== this.$store.state.product.price) {
        await this.$apollo.mutate({
          mutation: gql`
            mutation EditProduct(
              $id: ID!
              $price: Float!
            ) {
              updateProduct(
                id: $id
                input: { price: $price }
              ) {
                product {
                  id
                }
              }
            }
          `,
          variables: {
            id: this.$store.state.product.id,
            price: Number(this.price.replace(/[^\d,-]/g, '').replace(',', '.'))
          }
        })
        this.price = this.price.replace(/[^\d,-]/g, '')
        this.$store.commit("product/setPrice", this.price.replace(/[^\d,-]/g, '').replace(',', '.'))
        this.$apollo.provider.clients.products.cache.data.clear()
      }
      this.editPrice = false
    }
  }
}
</script>

