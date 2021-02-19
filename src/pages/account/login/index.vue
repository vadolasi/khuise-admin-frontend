<template lang="pug">
div(class="flex h-screen")
  div(class="w-4/5 lg:w-1/3 m-auto")
    div(v-if="loading")
      h1 Carregando
    div(v-else)
      label(class="text-gray-700") Email
      input(v-model="email" type="email" class="w-full my-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="text-gray-700") Senha
      input(v-model="password" type="password" class="w-full my-2 px-4 py-2 border rounded-lg text-pink-700 focus:outline-none focus:border-pink-500")
      label(class="inline-flex items-center mt-2")
        input(v-model="remember" type="checkbox" class="form-checkbox h-4 w-4")
        span(class="ml-2 text-gray-600 font-bold") Lembrar-me
      button(class="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full mt-5" @click="login") Entrar
</template>

<script>
export default {
  data: {
    email: "",
    password: "",
    remember: true
  },

  methods: {
    async login() {
      const loginResult = await this.$apollo.mutate({
        mutation: gql`
          mutation Login(
            $email: String!
            $password: String!
          ) {
            tokenAuth(input: {
              email: $email
              password: $password
            }) {
              success
              errors
              user {
                firstName
                lastName
              }
            }
          }
        `
      })

      if (loginResult.success) {
        this.$store.commit("auth/setFirstName", loginResult.firstName)
        this.$store.commit("auth/setLastName", loginResult.lastName)
        this.$store.commit("auth/setIsLogged", true)
        this.$router.push(this.$store.state.nextPath)
      }
    }
  }
}
</script>

