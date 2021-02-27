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
  addImage(state, id, image) {
    state.images.push({ node: { id: id, image: image } })
  },
  removeImage(state, index) {
    state.images.splice(index, 1)
  },
  updateImage(state, index, image) {
    state.images[index].node.image = image
  },
  setStock(state, stock) {
    state.stock = stock
  }
}
