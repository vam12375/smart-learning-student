<template>
  <div class="courses-container">
    <div class="courses-header">
      <h1>我的课程</h1>
      <div class="header-actions">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索课程..."
          style="width: 300px"
          @search="handleSearch"
        />
        <a-select
          v-model:value="statusFilter"
          placeholder="课程状态"
          style="width: 120px; margin-left: 16px"
          @change="handleFilterChange"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="NOT_STARTED">未开始</a-select-option>
          <a-select-option value="IN_PROGRESS">学习中</a-select-option>
          <a-select-option value="COMPLETED">已完成</a-select-option>
        </a-select>
      </div>
    </div>

    <a-spin :spinning="loading">
      <div class="courses-grid">
        <div
          v-for="course in courses"
          :key="course.id"
          class="course-card"
          @click="goToCourse(course.id)"
        >
          <div class="course-cover">
            <img :src="course.coverImage || '/default-course.jpg'" :alt="course.title" />
            <div class="course-status" :class="getStatusClass(course.status)">
              {{ getStatusText(course.status) }}
            </div>
            <div class="course-progress">
              <a-progress
                :percent="course.progress || 0"
                :show-info="false"
                stroke-color="#52c41a"
              />
            </div>
          </div>
          <div class="course-content">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>
            <div class="course-meta">
              <span class="course-teacher">
                <UserOutlined /> {{ course.teacherName }}
              </span>
              <span class="course-duration">
                <ClockCircleOutlined /> {{ course.duration }}分钟
              </span>
            </div>
            <div class="course-stats">
              <span class="lessons-count">
                <BookOutlined /> {{ course.lessonsCount }}课时
              </span>
              <span class="students-count">
                <TeamOutlined /> {{ course.studentsCount }}人学习
              </span>
            </div>
            <div class="course-actions">
              <a-button type="primary" size="small" @click.stop="continueLearning(course)">
                {{ course.progress > 0 ? '继续学习' : '开始学习' }}
              </a-button>
              <a-button size="small" @click.stop="viewDetails(course.id)">
                课程详情
              </a-button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="courses.length === 0 && !loading" class="empty-state">
        <a-empty description="暂无课程">
          <a-button type="primary" @click="goToCourseCatalog">
            浏览课程
          </a-button>
        </a-empty>
      </div>

      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-size-changer="false"
          :show-quick-jumper="true"
          @change="handlePageChange"
        />
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const loading = ref(false);
const searchKeyword = ref('');
const statusFilter = ref('');

interface Course {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  teacherName: string;
  duration: number;
  lessonsCount: number;
  studentsCount: number;
  status: string;
  progress: number;
  enrollTime: string;
}

const courses = ref<Course[]>([]);

const pagination = reactive({
  current: 1,
  pageSize: 12,
  total: 0,
});

// 模拟课程数据
const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Vue.js 3.0 完整教程',
    description: '从零开始学习Vue.js 3.0，掌握现代前端开发技能',
    coverImage: '',
    teacherName: '张老师',
    duration: 1200,
    lessonsCount: 24,
    studentsCount: 1580,
    status: 'IN_PROGRESS',
    progress: 45,
    enrollTime: '2024-01-15',
  },
  {
    id: 2,
    title: 'React 实战项目开发',
    description: '通过实际项目学习React开发，提升实战能力',
    coverImage: '',
    teacherName: '李老师',
    duration: 1800,
    lessonsCount: 32,
    studentsCount: 2340,
    status: 'NOT_STARTED',
    progress: 0,
    enrollTime: '2024-02-01',
  },
  {
    id: 3,
    title: 'JavaScript 高级编程',
    description: '深入学习JavaScript高级特性和设计模式',
    coverImage: '',
    teacherName: '王老师',
    duration: 1500,
    lessonsCount: 28,
    studentsCount: 1890,
    status: 'COMPLETED',
    progress: 100,
    enrollTime: '2023-12-01',
  },
];

const fetchCourses = async () => {
  loading.value = true;
  try {
    // 这里应该调用真实的API
    // const response = await courseApi.getMyCourses({
    //   page: pagination.current,
    //   size: pagination.pageSize,
    //   keyword: searchKeyword.value,
    //   status: statusFilter.value,
    // });
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredCourses = [...mockCourses];
    
    if (searchKeyword.value) {
      filteredCourses = filteredCourses.filter(course =>
        course.title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        course.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
      );
    }
    
    if (statusFilter.value) {
      filteredCourses = filteredCourses.filter(course => course.status === statusFilter.value);
    }
    
    courses.value = filteredCourses;
    pagination.total = filteredCourses.length;
  } catch (error) {
    message.error('获取课程列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  pagination.current = 1;
  fetchCourses();
};

const handleFilterChange = () => {
  pagination.current = 1;
  fetchCourses();
};

const handlePageChange = (page: number) => {
  pagination.current = page;
  fetchCourses();
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

const goToCourse = (courseId: number) => {
  router.push(`/courses/${courseId}`);
};

const continueLearning = (course: Course) => {
  router.push(`/courses/${course.id}/learn`);
};

const viewDetails = (courseId: number) => {
  router.push(`/courses/${courseId}/details`);
};

const goToCourseCatalog = () => {
  router.push('/catalog');
};

onMounted(() => {
  fetchCourses();
});
</script>

<style scoped>
.courses-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.courses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.courses-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  align-items: center;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.course-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.course-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.course-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
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

.course-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.course-content {
  padding: 20px;
}

.course-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

.course-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #7f8c8d;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta,
.course-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 12px;
  color: #95a5a6;
}

.course-actions {
  display: flex;
  gap: 8px;
}

.course-actions .ant-btn {
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
