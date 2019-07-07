<template>
  <div>
    <x-header
      class="header"
      :left-options="{showBack: false}"
      :right-options="{showMore: true}"
      @on-click-more="handleMore"
    >选择课程表</x-header>
    <swipeout>
      <swipeout-item v-for="(profile, index) in profiles" :key="index" transition-mode="follow">
        <div slot="right-menu">
          <swipeout-button @click.native="modifyProfile(index)" type="primary">修改</swipeout-button>
          <swipeout-button @click.native="deleteProfile(index)" type="warn">删除</swipeout-button>
        </div>
        <cell
          slot="content"
          :title="profile.name"
          :link="{ name: 'LessonSchedule', params: { id: index }}"
        />
      </swipeout-item>
    </swipeout>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  XHeader,
  Swipeout,
  SwipeoutItem,
  SwipeoutButton
} from 'vux'

export default {
  name: 'ProfileList',
  components: {
    Group,
    Cell,
    XHeader,
    Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  data() {
    return {
      profiles: []
    }
  },
  created() {
    this.profiles = JSON.parse(localStorage.getItem('profiles'))
    this.profiles = this.profiles ? this.profiles : []
  },
  methods: {
    handleMore() {
      this.$router.push('add')
    },
    modifyProfile(index) {
      this.$router.push({ name: 'ModifyProfile', params: { id: index } })
    },
    deleteProfile(index) {
      this.profiles.splice(index, 1)
      this.saveProfiles()
      this.$vux.toast.show({ text: '删除成功', type: 'success' })
    },
    saveProfiles() {
      localStorage.setItem('profiles', JSON.stringify(this.profiles))
    }
  }
}
</script>

<style scoped>
.header {
  border-bottom: #dedede 1px solid;
}

.list-item {
  padding: 10px 10px;
}
</style>
