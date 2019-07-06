import Vue from 'vue'
import Router from 'vue-router'
import ProfileList from '@/components/ProfileList'
import AddProfile from '@/components/AddProfile'
import LessonSchedule from '@/components/LessonSchedule'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'ProfileList', component: ProfileList },
    { path: '/add', name: 'AddProfile', component: AddProfile },
    { path: '/show/:id', name: 'LessonSchedule', component: LessonSchedule }
  ]
})
