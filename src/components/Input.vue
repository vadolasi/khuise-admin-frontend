<template lang="pug">
fragment
	input(ref="input" :value="value" v-bind="$attrs" @input="$emit('input', $event.target.value)" :type="type" class="text-pink-700 text-center border rounded-lg focus:border-pink-500 focus:outline-none" :class="error ? 'border-red-500 text-red-500' : ''")
	span(v-if="error" class="text-sm text-red-500") {{ error }}
</template>

<script>
export default {
	inheritAttrs: false,
	props: {
		value: {
			type: String,
			required: true
		},
		type: {
			type: String,
			default: "text"
		},
		error: {
			type: String,
			default: ""
		},
		focus: {
			type: Boolean,
			default: false
		}
	},
	mounted () {
		if (this.focus) {
			this.$refs.input.focus()
		}
	}
}
</script>

