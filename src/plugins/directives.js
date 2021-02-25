import Vue from "vue"

Vue.directive("focus", {
  inserted: function(el) {
    el.focus()
  },
  update: function(el, binding) {
    var value = binding.value
    if (value) {
      Vue.nextTick(function() {
        el.focus()
      })
    }
  }
})

