<template lang="pug">
fragment
  div(class="flex w-1/5 p-5 overflow-y-auto")
    div
      NuxtLink(to="/products/add/" class="hidden lg:block w-full text-center bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded")
        | Adicionar produto
      h2(class="text-pink-600 text-xl mt-5 font-bold") Ordenar por
      label(class="inline-flex items-center mt-3")
        input(type="radio" class="form-radio h-4 w-4" checked)
        span(class="ml-2 text-gray-600 font-light") Mais recente
      label(class="inline-flex items-center")
        input(type="radio" class="form-radio h-4 w-4")
        span(class="ml-2 text-gray-600 font-light") Mais antigo
      label(class="inline-flex items-center")
        input(type="radio" class="form-radio h-4 w-4")
        span(class="ml-2 text-gray-600 font-light") Maior preço
      label(class="inline-flex items-center")
        input(type="radio" class="form-radio h-4 w-4")
        span(class="ml-2 text-gray-600 font-light") Menor preço
      label(class="inline-flex items-center")
        input(type="radio" class="form-radio h-4 w-4")
        span(class="ml-2 text-gray-600 font-light") Ordem alfabetica
      h2(class="text-pink-600 text-xl mt-5 font-bold") Filtrar
      label(class="text-gray-600 font-light") Nome
      input(type="text" class="w-full mt-2 mb-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="text-gray-600 font-light") Preço
      div(class="grid grid-cols-2")
        input(type="number" placeholder="Minímo" class="w-full my-2 px-3 py-1 border rounded-lg text-xs text-pink-700 focus:outline-none focus:border-pink-500")
        input(type="number" placeholder="Máximo" class="w-full my-2 px-3 py-1 border rounded-lg text-xs text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="text-gray-600 font-light") Categorias
      br
      label(class="inline-flex items-center mt-2")
        input(type="checkbox" class="form-checkbox h-4 w-4" checked)
        span(class="ml-2 text-gray-600 font-bold") Todas
      div(class="grid grid-cols-2 mt-5")
        button(class="mr-1 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-1 px-3 rounded") Filtrar
        button(class="ml-1 w-full bg-trasparent border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white text-white font-bold py-1 px-3 rounded") Limpar
      div(class="h-5")
  div(class="flex flex-1 flex-col")
    div(class="flex flex-1 overflow-y-auto")
      div(class="md:px-4 lg:px-8 w-full pt-4")
        .grid.grid-cols-1(v-if="$apollo.loading" class="md:grid-cols-2 lg:grid-cols-4")
          SkelethonProduct
          SkelethonProduct
          SkelethonProduct
          SkelethonProduct
          SkelethonProduct
          SkelethonProduct
          SkelethonProduct
          SkelethonProduct
        .grid.grid-cols-1(v-else class="md:grid-cols-2 lg:grid-cols-4")
          Product(v-for="product in products.edges" v-bind:key="product.node.id" :product="product.node") 
</template>

<script>
import gql from "graphql-tag"

export default {
  name: "ProductsPage",
  head: {
    title: "Lista de produtos",
  },
  apollo: {
    $client: "products",
    products: {
      query: gql`
        query Products {
          products {
            edges {
              node {
                id
                name
                description
                price
                images(last: 1) {
                  edges {
                    node {
                      image
                    }
                  }
                } 
              } 
            }
          }
        }  
      `,
    }
  }
}
</script>

