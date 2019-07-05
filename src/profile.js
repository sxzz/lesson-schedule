const lessons = {
  chinese: { name: '语文', teacher: '张三' },
  math: { name: '数学', teacher: '李四' },
  english: { name: '英语', teacher: '王五' },
  physics: { name: '物理', teacher: '赵六' },
  chemistry: { name: '化学', teacher: '孙七' },
  biology: { name: '生物', teacher: '周八' }
}

export default {
  cycle: 6,
  startDate: '2019-06-30',
  endDate: '2019-07-23',
  schedule: [
    {
      name: '上午',
      startTime: '07:20',
      endTime: '11:45',
      lessons: [
        { name: '第一节', startTime: '07:20', endTime: '08:05' },
        { name: '第二节', startTime: '08:15', endTime: '09:00' },
        { name: '第三节', startTime: '09:10', endTime: '09:50' },
        { name: '第四节', startTime: '10:05', endTime: '10:50' },
        { name: '第五节', startTime: '11:00', endTime: '11:45' }
      ]
    },
    {
      name: '下午',
      startTime: '15:30',
      endTime: '18:05',
      lessons: [
        { name: '第六节', startTime: '15:30', endTime: '16:15' },
        { name: '第七节', startTime: '16:25', endTime: '17:10' },
        { name: '第八节', startTime: '17:20', endTime: '18:05' }
      ]
    },
    {
      name: '晚自习',
      startTime: '19:30',
      endTime: '21:30',
      lessons: [{ name: '晚自习', startTime: '19:30', endTime: '21:30' }]
    }
  ],
  days: [
    { name: 'DAY1', lessons: [{ name: '语文', teacher: '揭正卿' }] },
    { name: 'DAY2', lessons: [{ name: '语文', teacher: '揭正卿' }] },
    { name: 'DAY3', lessons: [{ name: '语文', teacher: '揭正卿' }] },
    { name: 'DAY4', lessons: [{ name: '语文', teacher: '揭正卿' }] },
    { name: 'DAY5', lessons: [{ name: '语文', teacher: '揭正卿' }] },
    {
      name: 'DAY6',
      lessons: [
        [
          lessons.english,
          lessons.english,
          lessons.math,
          lessons.physics,
          lessons.physics
        ],
        [lessons.biology, lessons.chinese, lessons.chemistry],
        [lessons.physics]
      ]
    }
  ]
}
