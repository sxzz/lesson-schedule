import Vue from 'vue'
import Router from 'vue-router'
import LessonSchedule from '@/components/LessonSchedule'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{ path: '/', name: 'LessonSchedule', component: LessonSchedule }]
})
