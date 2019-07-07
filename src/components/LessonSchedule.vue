<template>
  <div>
    <x-header
      class="header"
      :left-options="{showBack: true}"
      :right-options="{showMore: true}"
      @on-click-more="handleMore"
    >课程表</x-header>

    <div class="info">
      <span class="title">现在时间</span>
      <span class="time">{{ time }}</span>
      <span class="date">{{ displayDate }}</span>
    </div>

    <div v-if="remainDuration" class="info">
      <span class="title">距下课还有</span>
      <span class="time">{{ remainDuration }}</span>
    </div>

    <div v-else-if="nextDuration" class="info">
      <span class="title">距上课还有</span>
      <span class="time">{{ nextDuration }}</span>
    </div>

    <group class="lessons">
      <div v-for="(period, index) in schedule" :key="index">
        <cell
          :title="period.name"
          is-link
          :border-intent="false"
          :arrow-direction="period.show ? 'up' : 'down'"
          @click.native="switchPeriodShow(index)"
        ></cell>
        <div :class="period.show ? 'animate' : ''" class="slide lessons-list">
          <div
            v-for="(lesson, lession_index) in lessons[index]"
            :key="lession_index"
            class="lesson"
          >
            <div class="lesson-info">
              <h4 class="lesson-title">{{ lesson.name }}</h4>
              <p class="lesson-desc">
                <span>{{ period.lessons[lession_index].startTime }} ~ {{ period.lessons[lession_index].endTime }}</span>
                <span>{{ lesson.teacher }}</span>
                <span>{{ period.lessons[lession_index].progress.toFixed(2) }}%</span>
              </p>
            </div>
            <x-progress :percent="period.lessons[lession_index].progress" :show-cancel="false"></x-progress>
          </div>
        </div>
      </div>
    </group>

    <LessonTable :schedule="schedule" :lessons="lessons" style="margin-bottom: 10px;" />
  </div>
</template>

<script>
import dayjs from 'dayjs'
// import _ from 'lodash'
import {
  XHeader,
  Divider,
  Panel,
  XProgress,
  Group,
  Cell,
  TransferDom
} from 'vux'
import LessonTable from '@/components/LessonTable'

export default {
  name: 'LessonSchedule',
  components: {
    XHeader,
    Divider,
    Panel,
    XProgress,
    Group,
    Cell,
    LessonTable
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      timer: null,
      time: '',
      date: dayjs().format('YYYY-MM-DD'),
      schedule: [],
      lessons: [],
      remainDuration: null,
      nextDuration: null,
      profile: null,
      profile_name: ''
    }
  },
  created() {
    this.profiles = JSON.parse(localStorage.getItem('profiles'))
    const id = this.$route.params.id

    if (!this.profiles || this.profiles.length === 0 || !this.profiles[id]) {
      this.$router.push('/')
      return
    }
    const profileInfo = this.profiles[id]
    this.profile_name = profileInfo.name

    let profile
    try {
      profile = JSON.parse(profileInfo.content)
    } catch (err) {
      console.error(err)
      this.$vux.toast.show({ text: '配置文件错误', type: 'cancel' })
      this.$router.push('/')
      return
    }

    if (!profile || !profile.schedule || !profile.startDate || !profile.days) {
      this.$vux.toast.show({ text: '配置文件错误', type: 'cancel' })
      this.$router.push('/')
      return
    }

    this.schedule = profile.schedule
    this.profile = profile
    this.lessons = this.getDayLessons(dayjs())

    this.refreshTime()
    this.timer = setInterval(this.refreshTime, 1000)
  },
  computed: {
    displayDate() {
      if (!this.now) return ''
      const diff = dayjs(this.date).diff(this.now.startOf('day'), 'd')
      if (diff > 0) {
        if (diff === 1) {
          return '明天'
        }
        return `${diff} 天后`
      } else if (diff < 0) {
        if (diff === -1) {
          return '昨天'
        }
        return `${Math.abs(diff)} 天前`
      } else {
        return '今天'
      }
    }
  },
  methods: {
    changeDate(val) {
      const date = dayjs(val)
      this.lessons = this.getDayLessons(date)
      this.date = val
      this.schedule.forEach(period => (period.show = true))
    },
    handleMore() {
      // <datetime v-model="value7" @on-change="change" :title="$t('Birthday')" clear-text="today" @on-clear="setToday"></datetime>
      this.$vux.datetime.show({
        format: 'YYYY-MM-DD',
        value: this.date,
        startDate: this.profile.startDate,
        endDate: this.profile.endDate,
        cancelText: '取消',
        confirmText: '确定',
        clearText: '今天',
        onClear: () => {
          this.changeDate(dayjs().format('YYYY-MM-DD'))
        },
        onConfirm: val => {
          this.changeDate(val)
        }
      })
    },
    getDayLessons(date) {
      const startTime = dayjs(this.profile.startDate)
      const index = date.diff(startTime, 'day') % this.profile.cycle
      return this.profile.days[index].lessons
    },
    switchPeriodShow(index) {
      this.schedule[index].show = !this.schedule[index].show
      console.log(this.schedule[index].show)
    },
    refreshTime() {
      this.now = dayjs().add(this.profile.offset, 's')
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
            period.lessons[j].progressing = true
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

      if (nextLesson) {
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

.info {
  text-align: center;
  background-color: #fff;
  padding: 10px;
  margin: 10px;
  border-radius: 15px;
  border: #dedede 1px solid;

  .title {
    font-size: 0.9rem;
    color: #999;
    font-weight: 400;
  }

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

.slide {
  padding: 0 20px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
}

.animate {
  max-height: 9999px;
  transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
  transition-delay: 0s;
}

.lessons {
  margin-bottom: 10px;

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

        span:not(:first-child):before {
          content: ' | ';
        }
      }
    }
  }
}
</style>
