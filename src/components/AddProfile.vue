<template>
  <div>
    <x-header
      class="header"
      :left-options="{showBack: true}"
    >{{ this.mode === "add" ? '添加' : '修改' }}课程表</x-header>

    <group>
      <x-input v-model="name" placeholder="名称" />
      <x-textarea v-model="content" placeholder="内容" :rows="15" />
    </group>

    <div style="padding:15px;">
      <x-button @click.native="submit" type="primary">{{ this.mode === "add" ? '添加' : '修改' }}</x-button>
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
      mode: '',
      id: null,
      name: '',
      content: ''
    }
  },
  created() {
    this.mode = this.$route.meta.mode
    if (this.mode === 'modify') {
      this.id = this.$route.params.id
      this.profiles = JSON.parse(localStorage.getItem('profiles'))
      if (
        !this.profiles ||
        this.profiles.length === 0 ||
        !this.profiles[this.id]
      ) {
        this.$router.push('/')
        return
      }
      const profile = this.profiles[this.id]
      this.name = profile.name
      this.content = profile.content
    }
  },
  methods: {
    submit() {
      let profiles
      try {
        profiles = JSON.parse(localStorage.getItem('profiles'))
      } catch (e) {}
      if (!profiles) {
        profiles = []
      }

      if (this.mode === 'add') {
        profiles.push({
          name: this.name,
          content: this.content
        })
      } else if (this.mode === 'modify') {
        profiles[this.id] = {
          name: this.name,
          content: this.content
        }
      }
      this.$vux.toast.show({
        text: `${this.mode === 'add' ? '添加' : '修改'}成功`,
        type: 'success'
      })
      localStorage.setItem('profiles', JSON.stringify(profiles))
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
