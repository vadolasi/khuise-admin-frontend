export const state = () => ({
  id: "",
  pk: null,
  name: "",
  description: "",
  price: "",
  images: [],
  stock: [],
  deleteStockModal: [],
  editStock: [],
  addingStock: []
})

export const mutations = {
  setId(state, id) {
    state.id = id
  },
  setName(state, name) {
    state.name = name
  },
  setDescription(state, description) {
    state.description = description
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

