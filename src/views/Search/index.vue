<template>
  <div>
    <van-search v-model="value" shape="round" placeholder="请输入搜索关键词" @input="inputFn"/>
    <!-- 搜索下容器 -->
    <div class="search_wrap" v-if="resultList.length ===0">
      <p class="hot_title">热门搜索</p>
      <div class="hot_name_wrap">
        <p class="hot_item"
        v-for="(item,i) in hotArr"
        :key='i'
        @click="fn(item.first)">{{item.first}}</p>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="search_wrap" v-else>
      <!-- 标题 -->
      <p class="hot_title">最佳匹配</p>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
       <!-- <van-cell center :title="item.name" :label="item.ar[0].name +' -'+ item.name "
                  v-for="item in resultList" :key="item.id">
            <template #right-icon>
              <van-icon name="play-circle-o" size="20" />
            </template>
        </van-cell> -->
        <SongItem v-for="item in resultList" :key="item.id"
        :name="item.name"
        :author="item.ar[0].name"
        :id="item.id"></SongItem>
      </van-list>
    </div>
  </div>
</template>

<script>
// 目标: 铺设热搜关键字
// 1. 搜索框van-search组件, 关键词标签和样式
// 2. 找接口, api/Search.js里定义获取搜索关键词的请求方法
// 3. 引入到当前页面, 调用接口拿到数据循环铺设页面
// 4. 点击关键词把值赋予给van-search的v-model变量

// 目标: 铺设搜索结果
// 1. 找到搜索结果的接口 - api/Search.js定义请求方法
// 2. 再定义methods里getListFn方法(获取数据)
// 3. 在点击事件方法里调用getListFn方法拿到搜索结果数据
// 4. 铺设页面(首页van-cell标签复制过来)
// 5. 把数据保存到data后, 循环van-cell使用即可(切换歌手字段)
// 6. 互斥显示搜索结果和热搜关键词

// 目标: 搜索框-显示结果
// 1. @input给van-search绑定事件
// 2. @input事件中, 获取搜索结果保存 resultList中
// 3. 判断如果搜索关键字为空(.length === 0), 数组清空, 阻止网络请求执行(提前return)

// 目标: 加载更多
// 1. 集成list组件-定义相关的变量(搞懂变量的作用) -监测触底事件
// 2. 一旦触底, 自动执行onload方法
// 3. 对page++, 给后台传递offset偏移量参数-请求下一页的数据
// 4. 把当前数据和下一页新来的数据拼接起来用在当前 页面的数组里
// (切记) - 加载更多数据后,一定要把loading改成false, 保证下一次还能触发onload方法

import { hotSearchAPI, searchResultListAPI } from '@/api/index'
// import SongItem from '@/components/SongItem'
import SongItem from '@/components/SongItem.vue'
export default {
  data() {
    return {
      value: '',
      hotArr: [], // 热搜关键字
      resultList: [], // 搜索结果
      loading: false, // 加载中 (状态) - 只有为false, 才能触底后自动触发onload方法
      finished: false, // 未加载全部 (如果设置为true, 底部就不会再次执行onload, 代表全部加载完成)
      page: 1, // 当前搜索页码
      timer: null // 定时器
    }
  },
  async created() {
    const res = await hotSearchAPI()
    console.log(res)
    this.hotArr = res.data.result.hots
  },
  methods: {
    async getListFn() {
      return await searchResultListAPI({
        keywords: this.value,
        limit: 20,
        offset: (this.page - 1) * 20
      })
    }, // 把搜索结果return出去
    // (难点):
    // async修饰的函数 -> 默认返回一个全新Promise对象
    // 这个Promise对象的结果就是async函数内return的值
    // 拿到getListFn的返回值用await提取结果
    async fn(val) {
      // 点击热搜关键词
      this.page = 1 // 点击重新获取第一页数据
      this.finished = false // 点击新关键词 -可能有新的数据
      this.value = val // 选中的关键词显示到搜索框
      const res = await this.getListFn()
      console.log(res)
      this.resultList = res.data.result.songs
      this.loading = false // 本次数据加载完毕-才能让list加载更多
    },
    async inputFn() {
      // 目标： 实现防抖
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(async() => {
        this.page = 1 // 点击重新获取第一页数据
        this.finished = false // 输入框改变可能有新的数据改变
        // 判断如果搜索关键字为空(.length === 0), 数组清空, 阻止网络请求执行(提前return)
        if (this.value.length === 0) {
          this.resultList = []
          return
        }
        const res = await this.getListFn()
        console.log(res)
        if (res.data.result.songs === undefined) {
          // 没有数据
          this.resultList = []
          return
        }
        this.resultList = res.data.result.songs
        this.loading = false
      }, 900)
    },
    async onLoad() {
      this.page++
      const res = await this.getListFn()
      if (res.data.result.songs === undefined) {
        // 没有数据
        this.finished = true
        this.loading = false
        return
      }
      this.resultList = [...this.resultList, ...res.data.result.songs]
      this.loading = false
    }
  },
  components: {
    SongItem
  }
}
</script>

<style lang="less" scoped>
/* 搜索容器的样式 */
.search_wrap {
  padding: 0.266667rem;
}

/*热门搜索文字标题样式 */
.hot_title {
  font-size: 0.32rem;
  color: #666;
}

/* 热搜词_容器 */
.hot_name_wrap {
  margin: 0.266667rem 0;
}

/* 热搜词_样式 */
.hot_item {
  display: inline-block;
  height: 1.3rem;
  margin-right: 0.4rem;
  margin-bottom: 0.213333rem;
  padding: 0 1rem;
  font-size: 0.4rem;
  line-height: 1.3rem;
  color: #333;
  border-color: #d3d4da;
  border-radius: 0.853333rem;
  border: 1px solid #d3d4da;
}
</style>
