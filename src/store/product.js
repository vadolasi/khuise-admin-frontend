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
  setPrice(state, price) {
    state.price = price
  },
  setImages(state, images) {
    state.images = images
  },
  setStock(state, stock) {
    state.stock = stock
  },
  setStockControllers(state, stockLength) {
    var base = []

    for (var i = 0; i < stockLength; i++) {
      base.push(false)
    }

    state.deleteStockModal = base
    state.editStock = base
    state.addingStock = base
  },
  removeStock(state, index) {
    state.stock.splice(index)
  },
  preAddStock(state) {
    state.stock.push({ node: { name: "", description: "", price: "" } })
    state.addingStock.push(false)
  }
}

