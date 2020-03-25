<template>
  <div>
    WorkBench
  </div>
</template>

<script>
export default {
  name: "WorkBench",
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
