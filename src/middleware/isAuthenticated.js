import gql from "graphql-tag"

export default async function (context) {
  if (context.$store.state.isLogged) {
    if (context.route.path !== "/account/login") {
      const meResult = await this.$apollo.mutate({
        mutation: gql`
          query Me {
            me {
              email
              fisrtName
              lastName
            }
          }
        `
      })
      if (meResult) {
        context.$store.commit("auth/setIsLogged", true)
        context.redirect(context.from.path)
      } else {
        context.$store.commit("auth/setNextPath", context.from.path)
        context.redirect("/account/login")
      }
    }
  }
}

