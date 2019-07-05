<template>
  <div>
    <x-header
      class="header"
      :left-options="{showBack: false}"
      :right-options="{showMore: false}"
      @on-click-more="showMenus = true"
    >课程表</x-header>

    <div class="day-info">
      <divider>现在时间</divider>
      <span class="time">{{ time }}</span>
      <span class="date">{{ date }}</span>
    </div>

    <div class="lessons">
      <div v-for="(period, index) in schedule" :key="index">
        <divider>{{ period.name }}</divider>
        <div class="lessons-list">
          <div
            v-for="(lesson, lession_index) in lessons[index]"
            :key="lession_index"
            class="lesson"
          >
            <div class="lesson-info">
              <h4 class="lesson-title">{{ lesson.name }}</h4>
              <p
                class="lesson-desc"
              >{{ period.lessons[lession_index].startTime }} ~ {{ period.lessons[lession_index].endTime }}</p>
            </div>
            <x-progress :percent="0" :show-cancel="false"></x-progress>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import _ from 'lodash'
import { XHeader, Divider, Panel, XProgress } from 'vux'
import profile from '@/profile.js'

export default {
  name: 'LessonSchedule',
  components: {
    XHeader,
    Divider,
    Panel,
    XProgress
  },
  data() {
    return {
      timer: null,
      time: dayjs().format('HH:mm:ss'),
      date: dayjs().format('MM月DD日'),
      schedule: [],
      lessons: []
    }
  },
  created() {
    this.timer = setInterval(() => {
      this.time = dayjs().format('HH:mm:ss')
    }, 1000)

    const now = dayjs()
    const startTime = dayjs(profile.startDate)
    const index = now.diff(startTime, 'day') % profile.cycle
    const day = profile.days[index]
    const lessons = day.lessons

    this.schedule = profile.schedule
    this.lessons = lessons
  },
  computed: {}
}
</script>

<style lang="less" scoped>
.header {
  border-bottom: #dedede 1px solid;
}

.day-info {
  text-align: center;
  margin-top: 10px;

  .time {
    display: block;
    font-size: 4rem;
    margin: -0.8rem 0;
  }

  .date {
    display: block;
    font-size: 1.3rem;
  }
}
</style>

<style lang="less">
.lessons {
  .lessons-list {
    background-color: #ffffff;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
  }
  .lesson {
    text-align: center;
    position: relative;

    &:before {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #e5e5e5;
      color: #e5e5e5;
      transform-origin: 0 0;
      transform: scaleY(0.5);
      left: 15px;
    }

    .lesson-info {
      padding: 15px;

      .lesson-title {
        font-weight: 400;
        font-size: 17px;
        width: auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        word-wrap: break-word;
        word-break: break-all;
        font-size: 2rem;
      }

      .lesson-desc {
        color: #999;
        font-size: 13px;
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  }
}
</style>
