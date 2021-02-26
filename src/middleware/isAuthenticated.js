import gql from "graphql-tag"

export default async function (context) {
  if (!context.store.state.isLogged) {
    if (context.route.path !== "/account/login") {
      const { 
        app: { apolloProvider: { defaultClient: apollo } }
      } = context

      const { data: { me: meData } } = await apollo.mutate({
        mutation: gql`
          query Me {
            me {
              email
              firstName
              lastName
            }
          }
        `
      })
      if (true) {
        context.store.commit("auth/setIsLogged", true)
        context.redirect(context.store.state.nextPath)
      } else {
        context.store.commit("auth/setNextPath", context.route.path)
        context.redirect("/account/login")
      }
    }
  } else {
    if (context.route.path == "/account/login") {
      context.redirect("/")
    }
  }
}

