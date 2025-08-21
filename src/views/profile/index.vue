<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="avatar-section">
        <a-avatar :size="120" :src="userInfo.avatarUrl">
          <template #icon><UserOutlined /></template>
        </a-avatar>
        <a-button type="primary" size="small" style="margin-top: 8px" @click="handleAvatarClick">
          <UploadOutlined /> 更换头像
        </a-button>
      </div>
      <div class="user-info">
        <h2>{{ userInfo.nickname || userInfo.username }}</h2>
        <p class="user-role">
          <a-tag :color="getRoleColor(userInfo.role)">
            {{ getRoleText(userInfo.role) }}
          </a-tag>
        </p>
        <p class="user-email">{{ userInfo.email }}</p>
        <p class="join-time">加入时间：{{ formatDate(userInfo.createTime) }}</p>
      </div>
    </div>

    <a-row :gutter="24">
      <a-col :span="16">
        <a-card title="个人信息" style="margin-bottom: 24px">
          <a-form
            ref="formRef"
            :model="formData"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-item label="用户名">
              <a-input v-model:value="formData.username" disabled />
            </a-form-item>
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="formData.nickname" />
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-model:value="formData.email" disabled />
            </a-form-item>
            <a-form-item label="手机号" name="phone">
              <a-input v-model:value="formData.phone" />
            </a-form-item>
            <a-form-item label="性别" name="gender">
              <a-radio-group v-model:value="formData.gender">
                <a-radio :value="0">未知</a-radio>
                <a-radio :value="1">男</a-radio>
                <a-radio :value="2">女</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="生日" name="birthday">
              <a-date-picker v-model:value="formData.birthday" style="width: 100%" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
              <a-button type="primary" @click="handleSave" :loading="saving">
                保存修改
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="详细资料">
          <a-form
            ref="profileFormRef"
            :model="profileData"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-form-item label="真实姓名" name="realName">
              <a-input v-model:value="profileData.realName" />
            </a-form-item>
            <a-form-item label="学历" name="education">
              <a-select v-model:value="profileData.education" placeholder="请选择学历">
                <a-select-option value="HIGH_SCHOOL">高中</a-select-option>
                <a-select-option value="COLLEGE">大专</a-select-option>
                <a-select-option value="BACHELOR">本科</a-select-option>
                <a-select-option value="MASTER">硕士</a-select-option>
                <a-select-option value="DOCTOR">博士</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="职业" name="profession">
              <a-input v-model:value="profileData.profession" />
            </a-form-item>
            <a-form-item label="公司" name="company">
              <a-input v-model:value="profileData.company" />
            </a-form-item>
            <a-form-item label="个人简介" name="bio">
              <a-textarea v-model:value="profileData.bio" :rows="3" />
            </a-form-item>
            <a-form-item label="学习目标" name="learningGoals">
              <a-textarea v-model:value="profileData.learningGoals" :rows="2" />
            </a-form-item>
            <a-form-item label="兴趣标签" name="interests">
              <a-select
                v-model:value="profileData.interests"
                mode="tags"
                placeholder="请输入兴趣标签"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="微信号" name="wechat">
              <a-input v-model:value="profileData.wechat" />
            </a-form-item>
            <a-form-item label="QQ号" name="qq">
              <a-input v-model:value="profileData.qq" />
            </a-form-item>
            <a-form-item label="个人网站" name="website">
              <a-input v-model:value="profileData.website" />
            </a-form-item>
            <a-form-item label="GitHub" name="github">
              <a-input v-model:value="profileData.github" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
              <a-button type="primary" @click="handleProfileSave" :loading="profileSaving">
                保存资料
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="学习统计" style="margin-bottom: 24px">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ userStats.totalStudyTime || 0 }}</div>
              <div class="stat-label">学习时长(分钟)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.enrolledCourses || 0 }}</div>
              <div class="stat-label">报名课程</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.completedCourses || 0 }}</div>
              <div class="stat-label">完成课程</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.completedLessons || 0 }}</div>
              <div class="stat-label">完成课时</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.noteCount || 0 }}</div>
              <div class="stat-label">学习笔记</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ userStats.favoriteCount || 0 }}</div>
              <div class="stat-label">收藏课程</div>
            </div>
          </div>
        </a-card>

        <a-card title="积分等级">
          <div class="level-info">
            <div class="level-circle">
              <div class="level-number">{{ userStats.currentLevel || 1 }}</div>
              <div class="level-text">等级</div>
            </div>
            <div class="points-info">
              <p>总积分：{{ userStats.totalPoints || 0 }}</p>
              <p>连续学习：{{ userStats.continuousDays || 0 }} 天</p>
              <p>最长连续：{{ userStats.maxContinuousDays || 0 }} 天</p>
            </div>
          </div>
        </a-card>

        <a-card title="考试统计" style="margin-top: 24px">
          <div class="exam-stats">
            <a-row :gutter="16">
              <a-col :span="12">
                <div class="exam-stat">
                  <div class="exam-value">{{ userStats.examCount || 0 }}</div>
                  <div class="exam-label">考试次数</div>
                </div>
              </a-col>
              <a-col :span="12">
                <div class="exam-stat">
                  <div class="exam-value">{{ userStats.examPassCount || 0 }}</div>
                  <div class="exam-label">通过次数</div>
                </div>
              </a-col>
            </a-row>
            <div class="average-score">
              <span>平均分数：</span>
              <span class="score">{{ (userStats.averageScore || 0).toFixed(1) }}</span>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined, UploadOutlined } from '@ant-design/icons-vue';

const formRef = ref();
const profileFormRef = ref();
const saving = ref(false);
const profileSaving = ref(false);

// 简化的用户信息，使用默认值
const userInfo = ref({
  id: 1,
  username: 'student001',
  nickname: '学生用户',
  email: 'student@example.com',
  phone: '13800138000',
  role: 'STUDENT',
  avatarUrl: '',
  createTime: '2024-01-01T00:00:00Z',
  gender: 0,
  birthday: null,
});

// 简化的用户统计
const userStats = ref({
  totalStudyTime: 120,
  enrolledCourses: 3,
  completedCourses: 1,
  completedLessons: 15,
  noteCount: 8,
  favoriteCount: 5,
  examCount: 2,
  examPassCount: 1,
  averageScore: 85.5,
  totalPoints: 1200,
  currentLevel: 3,
  continuousDays: 7,
  maxContinuousDays: 15,
});

const formData = reactive({
  username: 'student001',
  nickname: '学生用户',
  email: 'student@example.com',
  phone: '13800138000',
  gender: 0,
  birthday: null,
});

const profileData = reactive({
  userId: 1,
  realName: '张三',
  education: 'BACHELOR',
  profession: '软件工程师',
  company: '科技公司',
  bio: '热爱学习的程序员',
  learningGoals: '成为全栈开发工程师',
  interests: ['编程', '技术', '学习'],
  wechat: 'wechat123',
  qq: '123456789',
  website: 'https://example.com',
  github: 'https://github.com/example',
});

onMounted(() => {
  // 页面加载时的初始化逻辑
  console.log('个人中心页面已加载');
});

const handleSave = async () => {
  try {
    saving.value = true;
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success('个人信息更新成功');
  } catch {
    message.error('个人信息更新失败');
  } finally {
    saving.value = false;
  }
};

const handleProfileSave = async () => {
  try {
    profileSaving.value = true;
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success('详细资料更新成功');
  } catch {
    message.error('详细资料更新失败');
  } finally {
    profileSaving.value = false;
  }
};

const handleAvatarClick = () => {
  message.info('头像上传功能开发中...');
};

const getRoleColor = (role: string) => {
  const roleMap: Record<string, string> = {
    ADMIN: 'red',
    TEACHER: 'blue',
    STUDENT: 'green',
  };
  return roleMap[role] || 'default';
};

const getRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    ADMIN: '管理员',
    TEACHER: '教师',
    STUDENT: '学生',
  };
  return roleMap[role] || role;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN');
};
</script>

<style scoped>
.profile-container {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.profile-header {
  display: flex;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-section {
  text-align: center;
  margin-right: 32px;
}

.user-info h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.user-role {
  margin: 8px 0;
}

.user-email {
  color: #666;
  margin: 4px 0;
}

.join-time {
  color: #999;
  font-size: 14px;
  margin: 4px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.level-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff, #52c41a);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.level-number {
  font-size: 24px;
  font-weight: 600;
}

.level-text {
  font-size: 12px;
}

.points-info p {
  margin: 4px 0;
  color: #666;
}

.exam-stats {
  text-align: center;
}

.exam-stat {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.exam-value {
  font-size: 20px;
  font-weight: 600;
  color: #52c41a;
  margin-bottom: 4px;
}

.exam-label {
  font-size: 12px;
  color: #666;
}

.average-score {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.score {
  font-size: 18px;
  font-weight: 600;
  color: #fa8c16;
}
</style>
