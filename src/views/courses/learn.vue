<template>
  <div class="learn-container">
    <div class="learn-header">
      <div class="course-info">
        <h2>{{ course.title }}</h2>
        <span class="current-lesson">{{ currentLesson.title }}</span>
      </div>
      <div class="learn-actions">
        <a-button @click="goBack">
          <ArrowLeftOutlined /> 返回课程
        </a-button>
      </div>
    </div>

    <div class="learn-content">
      <div class="video-section">
        <div class="video-player">
          <div class="video-placeholder">
            <PlayCircleOutlined class="play-icon" />
            <p>视频播放器</p>
            <p class="video-info">{{ currentLesson.title }} - {{ currentLesson.duration }}分钟</p>
          </div>
        </div>
        
        <div class="video-controls">
          <a-button-group>
            <a-button @click="previousLesson" :disabled="!hasPrevious">
              <StepBackwardOutlined /> 上一课
            </a-button>
            <a-button type="primary" @click="togglePlay">
              <PlayCircleOutlined v-if="!isPlaying" />
              <PauseCircleOutlined v-else />
              {{ isPlaying ? '暂停' : '播放' }}
            </a-button>
            <a-button @click="nextLesson" :disabled="!hasNext">
              下一课 <StepForwardOutlined />
            </a-button>
          </a-button-group>
          
          <div class="progress-section">
            <span>学习进度</span>
            <a-progress
              :percent="lessonProgress"
              :show-info="false"
              stroke-color="#52c41a"
            />
            <span>{{ lessonProgress }}%</span>
          </div>
        </div>
      </div>

      <div class="sidebar">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="chapters" tab="课程目录">
            <div class="chapters-list">
              <div
                v-for="(chapter, chapterIndex) in course.chapters"
                :key="chapter.id"
                class="chapter-item"
              >
                <div class="chapter-header">
                  <span class="chapter-title">第{{ chapterIndex + 1 }}章 {{ chapter.title }}</span>
                </div>
                <div class="lessons-list">
                  <div
                    v-for="lesson in chapter.lessons"
                    :key="lesson.id"
                    class="lesson-item"
                    :class="{ 
                      'active': lesson.id === currentLesson.id,
                      'completed': lesson.completed 
                    }"
                    @click="selectLesson(lesson)"
                  >
                    <div class="lesson-icon">
                      <CheckCircleOutlined v-if="lesson.completed" class="completed-icon" />
                      <PlayCircleOutlined v-else-if="lesson.id === currentLesson.id" class="current-icon" />
                      <PlayCircleOutlined v-else class="play-icon" />
                    </div>
                    <div class="lesson-info">
                      <span class="lesson-title">{{ lesson.title }}</span>
                      <span class="lesson-duration">{{ lesson.duration }}分钟</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
          
          <a-tab-pane key="notes" tab="学习笔记">
            <div class="notes-section">
              <div class="note-editor">
                <a-textarea
                  v-model:value="currentNote"
                  placeholder="记录学习笔记..."
                  :rows="6"
                  :maxlength="1000"
                  show-count
                />
                <div class="note-actions">
                  <a-button type="primary" size="small" @click="saveNote">
                    <SaveOutlined /> 保存笔记
                  </a-button>
                </div>
              </div>
              
              <div class="notes-list">
                <h4>历史笔记</h4>
                <div
                  v-for="note in notes"
                  :key="note.id"
                  class="note-item"
                >
                  <div class="note-content">{{ note.content }}</div>
                  <div class="note-meta">
                    <span>{{ note.lessonTitle }}</span>
                    <span>{{ formatDate(note.createTime) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  ArrowLeftOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  CheckCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();

const activeTab = ref('chapters');
const isPlaying = ref(false);
const lessonProgress = ref(0);
const currentNote = ref('');

interface Lesson {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
}

interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface Course {
  id: number;
  title: string;
  chapters: Chapter[];
}

interface Note {
  id: number;
  content: string;
  lessonTitle: string;
  createTime: string;
}

const course = ref<Course>({
  id: 1,
  title: 'Vue.js 3.0 完整教程',
  chapters: [
    {
      id: 1,
      title: 'Vue.js 基础',
      lessons: [
        { id: 1, title: 'Vue.js 简介', duration: 15, completed: true },
        { id: 2, title: '环境搭建', duration: 20, completed: true },
        { id: 3, title: '第一个Vue应用', duration: 25, completed: false },
      ],
    },
    {
      id: 2,
      title: '组件开发',
      lessons: [
        { id: 4, title: '组件基础', duration: 30, completed: false },
        { id: 5, title: '组件通信', duration: 35, completed: false },
      ],
    },
  ],
});

const currentLesson = ref<Lesson>({
  id: 3,
  title: '第一个Vue应用',
  duration: 25,
  completed: false,
});

const notes = ref<Note[]>([
  {
    id: 1,
    content: 'Vue.js是一个渐进式JavaScript框架，易于学习和使用。',
    lessonTitle: 'Vue.js 简介',
    createTime: '2024-01-20 10:30:00',
  },
  {
    id: 2,
    content: '使用Vue CLI可以快速搭建Vue项目，提供了很多便利的功能。',
    lessonTitle: '环境搭建',
    createTime: '2024-01-20 11:15:00',
  },
]);

// 获取所有课时的平铺列表
const allLessons = computed(() => {
  const lessons: Lesson[] = [];
  course.value.chapters.forEach(chapter => {
    lessons.push(...chapter.lessons);
  });
  return lessons;
});

// 当前课时在列表中的索引
const currentLessonIndex = computed(() => {
  return allLessons.value.findIndex(lesson => lesson.id === currentLesson.value.id);
});

// 是否有上一课
const hasPrevious = computed(() => {
  return currentLessonIndex.value > 0;
});

// 是否有下一课
const hasNext = computed(() => {
  return currentLessonIndex.value < allLessons.value.length - 1;
});

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    // 模拟播放进度
    simulateProgress();
  }
};

const simulateProgress = () => {
  if (isPlaying.value && lessonProgress.value < 100) {
    setTimeout(() => {
      lessonProgress.value += 1;
      if (lessonProgress.value >= 100) {
        completeLesson();
      } else {
        simulateProgress();
      }
    }, 100);
  }
};

const completeLesson = () => {
  currentLesson.value.completed = true;
  message.success('课时学习完成！');
  
  // 自动播放下一课
  if (hasNext.value) {
    setTimeout(() => {
      nextLesson();
    }, 2000);
  }
};

const previousLesson = () => {
  if (hasPrevious.value) {
    const prevLesson = allLessons.value[currentLessonIndex.value - 1];
    selectLesson(prevLesson);
  }
};

const nextLesson = () => {
  if (hasNext.value) {
    const nextLesson = allLessons.value[currentLessonIndex.value + 1];
    selectLesson(nextLesson);
  }
};

const selectLesson = (lesson: Lesson) => {
  currentLesson.value = lesson;
  isPlaying.value = false;
  lessonProgress.value = lesson.completed ? 100 : 0;
  
  // 更新URL
  router.replace(`/courses/${course.value.id}/learn/${lesson.id}`);
};

const saveNote = async () => {
  if (!currentNote.value.trim()) {
    message.warning('请输入笔记内容');
    return;
  }
  
  try {
    // 这里应该调用API保存笔记
    const newNote: Note = {
      id: Date.now(),
      content: currentNote.value,
      lessonTitle: currentLesson.value.title,
      createTime: new Date().toLocaleString(),
    };
    
    notes.value.unshift(newNote);
    currentNote.value = '';
    message.success('笔记保存成功');
  } catch (error) {
    message.error('笔记保存失败');
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString();
};

const goBack = () => {
  router.push(`/courses/${course.value.id}`);
};

onMounted(() => {
  // 根据URL参数设置当前课时
  const lessonId = route.params.lessonId;
  if (lessonId) {
    const lesson = allLessons.value.find(l => l.id === Number(lessonId));
    if (lesson) {
      selectLesson(lesson);
    }
  }
});
</script>

<style scoped>
.learn-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
}

.learn-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1f1f1f;
  color: white;
}

.course-info h2 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.current-lesson {
  font-size: 14px;
  color: #ccc;
}

.learn-content {
  flex: 1;
  display: flex;
}

.video-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.video-player {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.video-placeholder {
  text-align: center;
  color: white;
}

.video-placeholder .play-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #1890ff;
}

.video-placeholder p {
  margin: 8px 0;
  font-size: 16px;
}

.video-info {
  color: #ccc !important;
  font-size: 14px !important;
}

.video-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #1f1f1f;
  color: white;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  margin-left: 24px;
}

.progress-section .ant-progress {
  flex: 1;
}

.sidebar {
  width: 400px;
  background: white;
  border-left: 1px solid #f0f0f0;
}

.chapters-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.chapter-header {
  padding: 12px 16px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  font-size: 14px;
  color: #2c3e50;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-bottom: 1px solid #f8f8f8;
}

.lesson-item:hover {
  background: #f0f0f0;
}

.lesson-item.active {
  background: #e6f7ff;
}

.lesson-item.completed {
  background: #f6ffed;
}

.lesson-icon {
  font-size: 16px;
}

.completed-icon {
  color: #52c41a;
}

.current-icon {
  color: #1890ff;
}

.play-icon {
  color: #95a5a6;
}

.lesson-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lesson-title {
  font-size: 14px;
  color: #2c3e50;
}

.lesson-duration {
  font-size: 12px;
  color: #95a5a6;
}

.notes-section {
  padding: 16px;
}

.note-editor {
  margin-bottom: 24px;
}

.note-actions {
  margin-top: 8px;
  text-align: right;
}

.notes-list h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #2c3e50;
}

.note-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  margin-bottom: 12px;
}

.note-content {
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.5;
  margin-bottom: 8px;
}

.note-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #95a5a6;
}
</style>
