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

    <div v-if="remainDuration" class="day-info">
      <divider>距下课还有</divider>
      <span class="time">{{ remainDuration }}</span>
    </div>

    <div v-else-if="nextDuration" class="day-info">
      <divider>距上课还有</divider>
      <span class="time">{{ nextDuration }}</span>
    </div>

    <group class="lessons">
      <div v-for="(period, index) in schedule" :key="index">
        <cell
          :title="period.name"
          is-link
          :border-intent="false"
          :arrow-direction="period.show ? 'up' : 'down'"
          @click.native="period.show = !period.show"
        ></cell>
        <template v-if="period.show">
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
              <x-progress :percent="period.lessons[lession_index].progress" :show-cancel="false"></x-progress>
            </div>
          </div>
        </template>
      </div>
    </group>
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import _ from 'lodash'
import { XHeader, Divider, Panel, XProgress, Group, Cell, CellBox } from 'vux'
import profile from '@/profile.js'

export default {
  name: 'LessonSchedule',
  components: {
    XHeader,
    Divider,
    Panel,
    XProgress,
    Group,
    Cell,
    CellBox
  },
  data() {
    return {
      timer: null,
      time: '',
      date: dayjs().format('MM月DD日'),
      schedule: [],
      lessons: [],
      remainDuration: null,
      nextDuration: null
    }
  },
  created() {
    this.timer = setInterval(this.refreshTime, 1000)

    const now = dayjs().add(profile.offset, 's')
    const startTime = dayjs(profile.startDate)
    const index = now.diff(startTime, 'day') % profile.cycle
    const day = profile.days[index]
    const lessons = day.lessons

    this.schedule = profile.schedule
    this.lessons = lessons

    this.refreshTime()
  },
  computed: {},
  methods: {
    refreshTime() {
      this.now = dayjs().add(profile.offset, 's')
      this.time = this.now.format('HH:mm:ss')

      const date = this.now.format('YYYY-MM-DD')
      let nextLesson

      for (let i = 0; i < this.schedule.length; i++) {
        const period = this.schedule[i]
        const startTime = dayjs(date + ' ' + period.startTime)
        const endTime = dayjs(date + period.endTime)
        this.schedule[i].status = this.getScheduleStatus(startTime, endTime)

        this.schedule[i].show =
          this.schedule[i].show === undefined
            ? this.schedule[i].status !== 'over'
            : this.schedule[i].show

        for (let j = 0; j < period.lessons.length; j++) {
          const lesson = period.lessons[j]
          const startTime = dayjs(date + ' ' + lesson.startTime)
          const endTime = dayjs(date + ' ' + lesson.endTime)
          const progress = this.getLessonProgress(startTime, endTime)
          period.lessons[j].progress = progress

          lesson.diff = startTime.diff(this.now)

          if (lesson.diff > 0) {
            if (nextLesson) {
              if (lesson.diff < nextLesson.diff) {
                nextLesson = lesson
              }
            } else {
              nextLesson = lesson
            }
          }
          if (progress > 0 && progress < 100) {
            const remainSeconds = endTime.diff(this.now, 's')
            if (remainSeconds) {
              this.remainDuration = this.now
                .startOf('day')
                .add(remainSeconds, 's')
                .format('HH:mm:ss')
            } else {
              this.remainDuration = null
            }
          }
        }
      }

      {
        const startTime = dayjs(date + nextLesson.startTime)
        const remainSeconds = startTime.diff(this.now, 's')
        if (remainSeconds) {
          this.nextDuration = this.now
            .startOf('day')
            .add(remainSeconds, 's')
            .format('HH:mm:ss')
        } else {
          this.nextDuration = null
        }
      }
    },

    getScheduleStatus(startTime, endTime) {
      if (this.now.isAfter(endTime)) {
        return 'over'
      } else if (this.now.isBefore(startTime)) {
        return 'waiting'
      } else {
        return 'processing'
      }
    },

    getLessonProgress(startTime, endTime) {
      if (this.now.isAfter(endTime)) {
        return 100
      } else if (this.now.isBefore(startTime)) {
        return 0
      } else {
        const duration = endTime.diff(startTime)
        const past = this.now.diff(startTime)
        return (past / duration) * 100
      }
    }
  }
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
