<template lang="pug">
div(class="w-1/2 mx-auto")
  button(@click="logout") Sair
</template>

<script>
export default {
  methods: {
    async logout() {
      this.$router.push("/account/login")
    }
  }
}
</script>

