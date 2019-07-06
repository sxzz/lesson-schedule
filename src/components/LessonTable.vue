<template>
  <div>
    <divider>课程表</divider>
    <x-table full-bordered style="background-color: #fff;">
      <thead>
        <tr style="background-color: #f7f7f7">
          <th>课时</th>
          <th>课程</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(period, index) in schedule">
          <tr :key="'period_' + index">
            <td colspan="2" style="font-weight: bold;">{{ period.name }}</td>
          </tr>
          <tr
            v-for="(lesson, lesson_index) in period.lessons"
            :key="lesson.name"
            :style="{ backgroundColor: lesson.progressing ? 'rgba(0,0,0,0.075)' : '' }"
          >
            <td>{{ lesson.name }}</td>
            <td
              :style="{ color: lesson.progressing ? 'red' : '' }"
            >{{ lessons[index][lesson_index].name }}</td>
          </tr>
        </template>
      </tbody>
    </x-table>
  </div>
</template>

<script>
import { Divider, XTable } from 'vux'

export default {
  components: {
    Divider,
    XTable
  },
  props: {
    schedule: Array,
    lessons: Array
  }
}
</script>
