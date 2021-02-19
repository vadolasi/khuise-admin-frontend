export const state = () => ({
  id: "",
  pk: null,
  name: "",
  description: "",
  price: "",
  images: [],
  stock: []
})

export const mutations = {
  setId(state, id) {
    state.id = id
  },
  setPk(state, pk) {
    state.pk = pk
  },
  setName(state, name) {
    state.name = name
  },
  setPrice(state, price) {
    state.price = price
  },
  setImages(state, images) {
    state.images = images
  },
  setStock(state, stock) {
    state.stock = stock
  }
}

