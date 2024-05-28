<script setup lang="ts">
import type { CategoryItem } from '@/types/home'

// 定义 props 接收数据
defineProps<{
  list: CategoryItem[]
}>()
</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      url="/pages/index/index"
      v-for="item in list"
      :key="item.id"
    >
      <image
        class="icon"
        src="https://consumer.huawei.com/etc/designs/huawei-cbg-site/clientlib-campaign-v4/common-v4/images/logo.svg"
      ></image>
      <text class="text">华为</text>
    </navigator>
  </view>
</template>

<style lang="scss">
@import '../styles/category.scss';
</style>
