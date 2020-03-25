<template>
  <div>
    ProcessingCenter
  </div>
</template>

<script>
export default {
  name: "ProcessingCenter",
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    sellerId() {
      return this.$store.state.seller.sellerId;
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
