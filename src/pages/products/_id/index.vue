<template lang="pug">
div(class="w-full overflow-auto")
  div(v-if="$apollo.loading" class="mx-auto my-5 w-4/5 lg:w-3/4 w-auto")
  div(v-else class="mx-auto my-5 w-4/5 lg:w-3/4 w-auto")
    div(class="lg:grid lg:grid-cols-3")
      CRUDImages
      CRUDProduct
    CRUDStock
</template>

<script>
import gql from "graphql-tag"

export default {
  head () {
    return {
      title: this.$store.state.name    
    }
  },
  apollo: {
    $client: "product",
    product () {
      var query = null

      if (this.$store.state.id == this.$route.params.id) {
        query = gql`
          query GetProduct(
            $id: ID!
          ) {
            product(id: $id) {
              description
              images(first: 2) {
                edges {
                  node {
                    id
                    image
                  }
                }
              }
              stock {
                edges {
                  node {
                    id
                    size
                    color
                    stock
                  }
                }
              }
            }
          }
        `
      } else {
        query = gql`
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
                    id
                    color
                    size
                    stock
                  }
                }
              }
            }
          }
        `
      }

      return {
        query: query,
        variables: {
          id: this.$route.params.id
        },
        update: ({ product }) => {
          if (
            this.$store.state.product.id
            !== this.$route.params.id
          ) {
      		  this.$store.commit("product/setId", this.$route.params.id)
            this.$store.commit("product/setName", product.name)
            this.$store.commit("product/setPrice", product.price)
          }

          this.$store.commit("product/setDescription", product.description)
          this.$store.commit("product/setStock", product.stock.edges)
          this.$store.commit("product/setImages", product.images.edges)

          return product
        }
      }
    }
  }
}
</script>

