<template>
  <div id="app">
    <router-view style="padding-bottom: 55px;"></router-view>
    <tabbar style="position: fixed;">
      <tabbar-item selected link="/">
        <span slot="label">课程表</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'
export default {
  name: 'app',
  components: {
    Tabbar,
    TabbarItem
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #edecf2;
}
</style>
