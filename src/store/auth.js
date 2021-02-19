export const state = () => ({
    email: "",
    firstName: "",
    lastName: "",
    isLogged: false,
    nextPath: "/"
})

export const mutations = {
  setEmail(state, email) {
    state.email = email
  },
  setFirstName(state, firstName) {
    state.firstName = firstName
  },
  setLastName(state, lastName) {
    state.lastName = lastName
  },
  setIsLogged(state, isLogged) {
    state.isLogged = isLogged
  },
  setNextPath(state, nextPath) {
    state.nextPath = nextPath
  }
}

