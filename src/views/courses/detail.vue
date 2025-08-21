<template>
  <div class="course-detail-container">
    <a-spin :spinning="loading">
      <!-- 课程头部信息 -->
      <div class="course-header">
        <div class="course-cover">
          <img :src="course.coverImage || '/default-course.jpg'" :alt="course.title" />
          <div class="course-overlay">
            <div class="course-status" :class="getStatusClass(course.status)">
              {{ getStatusText(course.status) }}
            </div>
          </div>
        </div>
        <div class="course-info">
          <h1 class="course-title">{{ course.title }}</h1>
          <p class="course-description">{{ course.description }}</p>
          <div class="course-meta">
            <div class="meta-item">
              <UserOutlined />
              <span>{{ course.teacherName }}</span>
            </div>
            <div class="meta-item">
              <ClockCircleOutlined />
              <span>{{ course.duration }}分钟</span>
            </div>
            <div class="meta-item">
              <BookOutlined />
              <span>{{ course.lessonsCount }}课时</span>
            </div>
            <div class="meta-item">
              <TeamOutlined />
              <span>{{ course.studentsCount }}人学习</span>
            </div>
          </div>
          <div class="course-progress-section">
            <div class="progress-info">
              <span>学习进度</span>
              <span>{{ course.progress || 0 }}%</span>
            </div>
            <a-progress
              :percent="course.progress || 0"
              stroke-color="#52c41a"
              :stroke-width="8"
            />
          </div>
          <div class="course-actions">
            <a-button type="primary" size="large" @click="startLearning">
              {{ course.progress > 0 ? '继续学习' : '开始学习' }}
            </a-button>
            <a-button size="large" @click="goBack">
              返回课程列表
            </a-button>
          </div>
        </div>
      </div>

      <!-- 课程内容 -->
      <div class="course-content">
        <a-row :gutter="24">
          <a-col :span="16">
            <!-- 课程章节 -->
            <a-card title="课程章节" class="chapters-card">
              <div class="chapters-list">
                <div
                  v-for="(chapter, index) in course.chapters"
                  :key="chapter.id"
                  class="chapter-item"
                >
                  <div class="chapter-header" @click="toggleChapter(index)">
                    <div class="chapter-title">
                      <span class="chapter-number">第{{ index + 1 }}章</span>
                      <span class="chapter-name">{{ chapter.title }}</span>
                    </div>
                    <div class="chapter-info">
                      <span class="chapter-duration">{{ chapter.duration }}分钟</span>
                      <DownOutlined :class="{ 'expanded': chapter.expanded }" />
                    </div>
                  </div>
                  <div v-show="chapter.expanded" class="lessons-list">
                    <div
                      v-for="lesson in chapter.lessons"
                      :key="lesson.id"
                      class="lesson-item"
                      :class="{ 'completed': lesson.completed, 'current': lesson.current }"
                      @click="playLesson(lesson)"
                    >
                      <div class="lesson-icon">
                        <CheckCircleOutlined v-if="lesson.completed" class="completed-icon" />
                        <PlayCircleOutlined v-else-if="lesson.current" class="current-icon" />
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
            </a-card>

            <!-- 课程介绍 -->
            <a-card title="课程介绍" style="margin-top: 24px;">
              <div class="course-intro" v-html="course.introduction"></div>
            </a-card>
          </a-col>

          <a-col :span="8">
            <!-- 学习统计 -->
            <a-card title="学习统计" style="margin-bottom: 24px;">
              <div class="stats-list">
                <div class="stat-item">
                  <span class="stat-label">已完成课时</span>
                  <span class="stat-value">{{ completedLessons }}/{{ totalLessons }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">学习时长</span>
                  <span class="stat-value">{{ studyTime }}分钟</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">最后学习</span>
                  <span class="stat-value">{{ lastStudyTime }}</span>
                </div>
              </div>
            </a-card>

            <!-- 相关课程 -->
            <a-card title="相关课程">
              <div class="related-courses">
                <div
                  v-for="relatedCourse in relatedCourses"
                  :key="relatedCourse.id"
                  class="related-course-item"
                  @click="goToCourse(relatedCourse.id)"
                >
                  <img :src="relatedCourse.coverImage || '/default-course.jpg'" :alt="relatedCourse.title" />
                  <div class="related-course-info">
                    <h4>{{ relatedCourse.title }}</h4>
                    <p>{{ relatedCourse.teacherName }}</p>
                  </div>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined,
  DownOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();
const loading = ref(false);

interface Lesson {
  id: number;
  title: string;
  duration: number;
  completed: boolean;
  current: boolean;
}

interface Chapter {
  id: number;
  title: string;
  duration: number;
  lessons: Lesson[];
  expanded: boolean;
}

interface Course {
  id: number;
  title: string;
  description: string;
  introduction: string;
  coverImage?: string;
  teacherName: string;
  duration: number;
  lessonsCount: number;
  studentsCount: number;
  status: string;
  progress: number;
  chapters: Chapter[];
}

const course = ref<Course>({
  id: 0,
  title: '',
  description: '',
  introduction: '',
  teacherName: '',
  duration: 0,
  lessonsCount: 0,
  studentsCount: 0,
  status: 'NOT_STARTED',
  progress: 0,
  chapters: [],
});

const relatedCourses = ref([
  {
    id: 2,
    title: 'React 实战项目开发',
    teacherName: '李老师',
    coverImage: '',
  },
  {
    id: 3,
    title: 'JavaScript 高级编程',
    teacherName: '王老师',
    coverImage: '',
  },
]);

const studyTime = ref(120);
const lastStudyTime = ref('2024-01-20');

const completedLessons = computed(() => {
  return course.value.chapters.reduce((total, chapter) => {
    return total + chapter.lessons.filter(lesson => lesson.completed).length;
  }, 0);
});

const totalLessons = computed(() => {
  return course.value.chapters.reduce((total, chapter) => {
    return total + chapter.lessons.length;
  }, 0);
});

const fetchCourseDetail = async () => {
  loading.value = true;
  try {
    const courseId = route.params.id;
    // 这里应该调用真实的API
    // const response = await courseApi.getCourseDetail(courseId);
    
    // 模拟数据
    course.value = {
      id: 1,
      title: 'Vue.js 3.0 完整教程',
      description: '从零开始学习Vue.js 3.0，掌握现代前端开发技能',
      introduction: '<p>这是一门全面的Vue.js 3.0教程，适合初学者和有一定基础的开发者。</p><p>课程内容包括：</p><ul><li>Vue.js基础概念</li><li>组件开发</li><li>状态管理</li><li>路由配置</li><li>项目实战</li></ul>',
      teacherName: '张老师',
      duration: 1200,
      lessonsCount: 24,
      studentsCount: 1580,
      status: 'IN_PROGRESS',
      progress: 45,
      chapters: [
        {
          id: 1,
          title: 'Vue.js 基础',
          duration: 300,
          expanded: true,
          lessons: [
            { id: 1, title: 'Vue.js 简介', duration: 15, completed: true, current: false },
            { id: 2, title: '环境搭建', duration: 20, completed: true, current: false },
            { id: 3, title: '第一个Vue应用', duration: 25, completed: false, current: true },
          ],
        },
        {
          id: 2,
          title: '组件开发',
          duration: 400,
          expanded: false,
          lessons: [
            { id: 4, title: '组件基础', duration: 30, completed: false, current: false },
            { id: 5, title: '组件通信', duration: 35, completed: false, current: false },
          ],
        },
      ],
    };
  } catch (error) {
    message.error('获取课程详情失败');
  } finally {
    loading.value = false;
  }
};

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    NOT_STARTED: 'status-not-started',
    IN_PROGRESS: 'status-in-progress',
    COMPLETED: 'status-completed',
  };
  return statusMap[status] || '';
};

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    NOT_STARTED: '未开始',
    IN_PROGRESS: '学习中',
    COMPLETED: '已完成',
  };
  return statusMap[status] || status;
};

const toggleChapter = (index: number) => {
  course.value.chapters[index].expanded = !course.value.chapters[index].expanded;
};

const playLesson = (lesson: Lesson) => {
  router.push(`/courses/${course.value.id}/learn/${lesson.id}`);
};

const startLearning = () => {
  router.push(`/courses/${course.value.id}/learn`);
};

const goBack = () => {
  router.push('/courses');
};

const goToCourse = (courseId: number) => {
  router.push(`/courses/${courseId}`);
};

onMounted(() => {
  fetchCourseDetail();
});
</script>

<style scoped>
.course-detail-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.course-header {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.course-cover {
  position: relative;
  width: 400px;
  height: 300px;
  flex-shrink: 0;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.3));
}

.course-status {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.status-not-started {
  background: #8c8c8c;
}

.status-in-progress {
  background: #1890ff;
}

.status-completed {
  background: #52c41a;
}

.course-info {
  flex: 1;
  padding: 32px;
}

.course-title {
  margin: 0 0 16px 0;
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.3;
}

.course-description {
  margin: 0 0 24px 0;
  font-size: 16px;
  color: #7f8c8d;
  line-height: 1.6;
}

.course-meta {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #95a5a6;
}

.course-progress-section {
  margin-bottom: 32px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
}

.course-actions {
  display: flex;
  gap: 16px;
}

.course-content {
  margin-top: 24px;
}

.chapters-card .ant-card-body {
  padding: 0;
}

.chapter-item {
  border-bottom: 1px solid #f0f0f0;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chapter-header:hover {
  background: #fafafa;
}

.chapter-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chapter-number {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.chapter-name {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
}

.chapter-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #95a5a6;
}

.expanded {
  transform: rotate(180deg);
}

.lessons-list {
  background: #fafafa;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px 12px 48px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.lesson-item:hover {
  background: #f0f0f0;
}

.lesson-item.completed {
  background: #f6ffed;
}

.lesson-item.current {
  background: #e6f7ff;
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

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
}

.related-courses {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.related-course-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.related-course-item:hover {
  transform: translateX(4px);
}

.related-course-item img {
  width: 60px;
  height: 45px;
  border-radius: 6px;
  object-fit: cover;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.related-course-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  line-height: 1.3;
}

.related-course-info p {
  margin: 0;
  font-size: 12px;
  color: #95a5a6;
}
</style>
