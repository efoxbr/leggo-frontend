<template>
  <div>
    <label>
        <button @click="changeButton()" :class="styleButton">
        <slot></slot>
        </button>
    </label>
  </div>
</template>

<script>

export default {
  name: 'OptionBotton',
  data () {
    return {
      active: true
    }
  },
  methods: {
    changeButton () {
      this.active = !this.active
      this.$emit('input', this.active)
    }
  },
  computed: {
    styleButton () {
      return {
        'active': this.active
      }
    }
  }
}
</script>

<style scoped>
.active {
    opacity: 0.3;
}

button {
    background-color:rgb(255, 255, 255);
    border-width: 0px;
    opacity: 1;
    padding: 5px;
    font-style: italic;
}
</style>
