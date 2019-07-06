<template>
  <div>
    <x-header class="header" :left-options="{showBack: true}">添加课程表</x-header>

    <group>
      <x-input v-model="name" placeholder="名称" />
      <x-textarea v-model="content" placeholder="内容" autosize />
    </group>

    <div style="padding:15px;">
      <x-button @click.native="add" type="primary">添加</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, XTextarea, XInput, XButton, Group } from 'vux'

export default {
  name: 'AddProfile',
  components: {
    XHeader,
    XInput,
    XTextarea,
    XButton,
    Group
  },
  data() {
    return {
      name: '',
      content: ''
    }
  },
  methods: {
    add() {
      let profiles
      try {
        profiles = JSON.parse(localStorage.getItem('profiles'))
      } catch (e) {}
      if (!profiles) {
        profiles = []
      }

      profiles.push({
        name: this.name,
        content: this.content
      })

      localStorage.setItem('profiles', JSON.stringify(profiles))

      this.$vux.toast.show({ text: '添加成功', type: 'success' })
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.header {
  border-bottom: #dedede 1px solid;
}
</style>
