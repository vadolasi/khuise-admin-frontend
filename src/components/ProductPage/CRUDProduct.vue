<template lang="pug">
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
</template>

<script>
export default {
	
}
</script>

