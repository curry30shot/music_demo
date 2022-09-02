<template>
  <van-cell center :title="name" :label="author +' -'+ name "
 :key="id">
  <template #right-icon>
    <van-icon name="play-circle-o" size="20" @click="playFn" />
  </template>
</van-cell>
</template>

<script>
export default {
  props: {
    name: String,
    author: String,
    id: Number
  },
  methods: {
    playFn() {
      this.$router.push({
        path: '/play',
        query: {
          id: this.id // 歌曲id, 通过路由跳转传递过去
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell{
  border-bottom: 1px solid lightgray;
}
</style>
