<template lang="pug">
fragment
  h2.mt-8.mb-4.text-2xl Estoque
    button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700 focus:outline-none" @click="preAddStock")
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
            Input(v-model="productType.node.color" :error="errors[index].color")
          td(class="text-center")
            Input(v-model="productType.node.size" :error="errors[index].size")
          td(class="text-center")
            Input(v-model="productType.node.stock" type="number" :error="errors[index].stock")
        fragment(v-else)
          td(class="text-center py-3 px-4") {{ productType.node.color }}
          td(class="text-center py-3 px-4") {{ productType.node.size }}
          td(class="text-center py-3 px-4") {{ productType.node.stock }}
        DangerConfirmModal(v-model="deleteStockModal[index]" title="Deletar estoque" message="Tem certeza que deseja deletar este estoque?" @confirm="deleteStock(productType.node.id, index)")
        td(class="py-3 px-4 flex justify-around")
          button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-if="editStock[index]" @click="setStock(productType.node.id, index)")
            span(class="material-icons align-middle") check
          button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-else-if="addingStock[index]" @click="addStock(index)")
            span(class="material-icons align-middle") check
          button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-else @click="$set(editStock, index, true)")
            span(class="material-icons align-middle") create
          button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-if="addingStock[index]" @click="stock.splice(index, 1);addingStock.splice(index, 1)")
            span(class="material-icons align-middle") close
          button(class="transition duration-200 ease-in-out bg-transparent rounded-full hover:text-pink-700 focus:outline-none" v-else @click="$set(deleteStockModal, index, true)")
            span(class="material-icons align-middle") delete
</template>

<script>
import gql from "graphql-tag"

export default {
  data () {
    const base = this.$store.state.product.stock.map(() => {
			return false
		})

    return {
      stock: [...this.$store.state.product.stock],
			errors: this.$store.state.product.stock.map(() => {
				return { color: "", size: "", stock: "" }
			}),
      deleteStockModal: [...base],
      editStock: [...base],
      addingStock: [...base]
		}
	},
  methods: {
    preAddStock(state) {
      this.stock.push({ node: { id: "", name: "", description: "", price: "" } })
      this.addingStock.push(true)
      this.errors.push({ node: {  name: "", description: "", price: "" } })
    },

    async addStock (index) {
      const { data: { addStock: stockData } } = await this.$apollo.mutate({
        mutation: gql`
          mutation AddStock(
            $color: String!
            $size: String!
            $stock: Int!
            $product: ID!
          ) {
            addStock(
              input: {
                color: $color
                size: $size
                stock: $stock
                product: $product
              }
            ) {
              stocks {
                id
              }
            }
          }
        `,
        variables: {
          color: this.stock[index].node.color,
          size: this.stock[index].node.size,
          stock: this.stock[index].node.stock,
          product: this.$store.state.product.id
        }
      })
      this.$set(
        this.stock,
        index,
        {
          node: {
            id: stockData.stocks[0].id,
            ...this.stock[index].node
          }
        }
      )
      this.$set(this.addingStock, index, false)
    },
    async deleteStock (id, index) {
      const data = await this.$apollo.mutate({
        mutation: gql`
          mutation RemoveStock(
            $id: ID!
          ) {
            deleteStock(id: $id) {
              found 
            }
          }
        `,
        variables: {
          id: id
        }
      })
      this.stock.splice(index, 1)
    },

    async setStock (id, index) {
      console.log(id)
      const data = await this.$apollo.mutate({
        mutation: gql`
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
              stock {
                id
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
      })

      this.$store.commit("product/setStock", this.stock)

      this.$set(this.editStock, index, false)
    }
  }
}
</script>

