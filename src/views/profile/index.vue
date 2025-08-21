<template>
  <div class="profile-container">
    <a-spin :spinning="loading" tip="加载中...">
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
          <a-tag :color="getRoleColor(userInfo.role || 'STUDENT')">
            {{ getRoleText(userInfo.role || 'STUDENT') }}
          </a-tag>
        </p>
        <p class="user-email">{{ userInfo.email }}</p>
        <p class="join-time">加入时间：{{ formatDate(userInfo.createTime || '') }}</p>
      </div>
    </div>

    <a-row :gutter="24">
      <a-col :span="16">
        <a-card title="个人信息" style="margin-bottom: 24px">
          <a-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            @finish="handleSave"
          >
            <a-form-item label="用户名">
              <a-input v-model:value="formData.username" disabled>
                <template #prefix>
                  <UserOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="昵称" name="nickname">
              <a-input
                v-model:value="formData.nickname"
                placeholder="请输入昵称"
                :maxlength="50"
                show-count
              >
                <template #prefix>
                  <UserOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-model:value="formData.email" disabled>
                <template #prefix>
                  <MailOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="手机号" name="phone">
              <a-input
                v-model:value="formData.phone"
                placeholder="请输入手机号"
                :maxlength="11"
              >
                <template #prefix>
                  <PhoneOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="性别" name="gender">
              <a-radio-group v-model:value="formData.gender">
                <a-radio :value="0">
                  <QuestionCircleOutlined /> 未知
                </a-radio>
                <a-radio :value="1">
                  <ManOutlined /> 男
                </a-radio>
                <a-radio :value="2">
                  <WomanOutlined /> 女
                </a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="生日" name="birthday">
              <a-date-picker
                v-model:value="formData.birthday"
                style="width: 100%"
                placeholder="请选择生日"
                :disabled-date="disabledDate"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
              <a-space>
                <a-button type="primary" html-type="submit" :loading="saving">
                  <SaveOutlined /> 保存修改
                </a-button>
                <a-button @click="resetForm">
                  <ReloadOutlined /> 重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>

        <a-card title="详细资料">
          <a-form
            ref="profileFormRef"
            :model="profileData"
            :rules="profileRules"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            @finish="handleProfileSave"
          >
            <a-form-item label="真实姓名" name="realName">
              <a-input
                v-model:value="profileData.realName"
                placeholder="请输入真实姓名"
                :maxlength="50"
                show-count
              >
                <template #prefix>
                  <UserOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="学历" name="education">
              <a-select v-model:value="profileData.education" placeholder="请选择学历">
                <a-select-option value="PRIMARY">小学</a-select-option>
                <a-select-option value="JUNIOR">初中</a-select-option>
                <a-select-option value="SENIOR">高中</a-select-option>
                <a-select-option value="BACHELOR">本科</a-select-option>
                <a-select-option value="MASTER">硕士</a-select-option>
                <a-select-option value="DOCTOR">博士</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="职业" name="profession">
              <a-input
                v-model:value="profileData.profession"
                placeholder="请输入职业"
                :maxlength="100"
                show-count
              >
                <template #prefix>
                  <BankOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="公司" name="company">
              <a-input
                v-model:value="profileData.company"
                placeholder="请输入公司名称"
                :maxlength="100"
                show-count
              >
                <template #prefix>
                  <HomeOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="个人简介" name="bio">
              <a-textarea
                v-model:value="profileData.bio"
                :rows="3"
                placeholder="请简单介绍一下自己..."
                :maxlength="500"
                show-count
              />
            </a-form-item>
            <a-form-item label="学习目标" name="learningGoals">
              <a-textarea
                v-model:value="profileData.learningGoals"
                :rows="2"
                placeholder="请描述您的学习目标..."
                :maxlength="300"
                show-count
              />
            </a-form-item>
            <a-form-item label="兴趣标签" name="interests">
              <a-select
                v-model:value="profileData.interests"
                mode="tags"
                placeholder="请输入兴趣标签，按回车添加"
                style="width: 100%"
                :max-tag-count="10"
              >
                <a-select-option value="编程">编程</a-select-option>
                <a-select-option value="设计">设计</a-select-option>
                <a-select-option value="数据分析">数据分析</a-select-option>
                <a-select-option value="人工智能">人工智能</a-select-option>
                <a-select-option value="前端开发">前端开发</a-select-option>
                <a-select-option value="后端开发">后端开发</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="联系方式">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item name="wechat" style="margin-bottom: 0;">
                    <a-input
                      v-model:value="profileData.wechat"
                      placeholder="微信号"
                      :maxlength="50"
                    >
                      <template #prefix>
                        <WechatOutlined style="color: rgba(0,0,0,.25)" />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item name="qq" style="margin-bottom: 0;">
                    <a-input
                      v-model:value="profileData.qq"
                      placeholder="QQ号"
                      :maxlength="20"
                    >
                      <template #prefix>
                        <QqOutlined style="color: rgba(0,0,0,.25)" />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="个人链接">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item name="website" style="margin-bottom: 0;">
                    <a-input
                      v-model:value="profileData.website"
                      placeholder="个人网站"
                      :maxlength="255"
                    >
                      <template #prefix>
                        <GlobalOutlined style="color: rgba(0,0,0,.25)" />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item name="github" style="margin-bottom: 0;">
                    <a-input
                      v-model:value="profileData.github"
                      placeholder="GitHub地址"
                      :maxlength="255"
                    >
                      <template #prefix>
                        <GithubOutlined style="color: rgba(0,0,0,.25)" />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="地址" name="address">
              <a-input
                v-model:value="profileData.address"
                placeholder="请输入地址"
                :maxlength="255"
                show-count
              >
                <template #prefix>
                  <EnvironmentOutlined style="color: rgba(0,0,0,.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
              <a-space>
                <a-button type="primary" html-type="submit" :loading="profileSaving">
                  <SaveOutlined /> 保存资料
                </a-button>
                <a-button @click="resetProfileForm">
                  <ReloadOutlined /> 重置
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="学习统计" style="margin-bottom: 24px">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ formatStudyTime(userStats.totalStudyTime || 0) }}</div>
              <div class="stat-label">学习时长</div>
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

        <!-- 学习进度 -->
        <a-card title="学习进度" style="margin-bottom: 24px">
          <LearningProgress
            title="课程完成率"
            :current="userStats.completedCourses || 0"
            :total="userStats.enrolledCourses || 1"
            description="已完成的课程数量"
            color="success"
          />
          <div style="margin: 16px 0;"></div>
          <LearningProgress
            title="学习活跃度"
            :current="userStats.continuousDays || 0"
            :total="30"
            description="本月连续学习天数"
            color="primary"
          />
        </a-card>

        <!-- 学习数据图表 -->
        <a-card title="学习趋势" style="margin-bottom: 24px">
          <LearningChart
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
          />
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
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
  ManOutlined,
  WomanOutlined,
  SaveOutlined,
  ReloadOutlined,
  BankOutlined,
  HomeOutlined,
  WechatOutlined,
  QqOutlined,
  GlobalOutlined,
  GithubOutlined,
  EnvironmentOutlined
} from '@ant-design/icons-vue';
import { userApi } from '@/api/user';
import type { User, UserProfile, UserStats } from '@/api/user';
import dayjs from 'dayjs';
import LearningChart from '@/components/LearningChart.vue';
import LearningProgress from '@/components/LearningProgress.vue';

const formRef = ref();
const profileFormRef = ref();
const saving = ref(false);
const profileSaving = ref(false);
const loading = ref(true);

// 用户信息
const userInfo = ref<Partial<User>>({
  id: 0,
  username: '',
  nickname: '',
  email: '',
  phone: '',
  role: 'STUDENT',
  avatarUrl: '',
  createTime: '',
  gender: 0,
  birthday: undefined,
  status: 1,
  lastLoginTime: '',
  lastLoginIp: '',
  updateTime: ''
});

// 用户统计
const userStats = ref<Partial<UserStats>>({
  id: 0,
  userId: 0,
  totalStudyTime: 0,
  enrolledCourses: 0,
  completedCourses: 0,
  completedLessons: 0,
  noteCount: 0,
  favoriteCount: 0,
  examCount: 0,
  examPassCount: 0,
  averageScore: 0,
  totalPoints: 0,
  currentLevel: 1,
  continuousDays: 0,
  maxContinuousDays: 0,
  lastStudyTime: ''
});

const formData = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: 0,
  birthday: null as dayjs.Dayjs | null,
});

const profileData = reactive<Partial<UserProfile>>({
  userId: 0,
  realName: '',
  education: '',
  profession: '',
  company: '',
  bio: '',
  learningGoals: '',
  interests: [],
  wechat: '',
  qq: '',
  website: '',
  github: '',
  address: ''
});

// 表单验证规则
const formRules = {
  nickname: [
    { max: 50, message: '昵称长度不能超过50个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
};

// 详细资料验证规则
const profileRules = {
  realName: [
    { max: 50, message: '真实姓名长度不能超过50个字符', trigger: 'blur' }
  ],
  profession: [
    { max: 100, message: '职业长度不能超过100个字符', trigger: 'blur' }
  ],
  company: [
    { max: 100, message: '公司名称长度不能超过100个字符', trigger: 'blur' }
  ],
  bio: [
    { max: 500, message: '个人简介长度不能超过500个字符', trigger: 'blur' }
  ],
  learningGoals: [
    { max: 300, message: '学习目标长度不能超过300个字符', trigger: 'blur' }
  ],
  wechat: [
    { max: 50, message: '微信号长度不能超过50个字符', trigger: 'blur' }
  ],
  qq: [
    { pattern: /^\d{5,20}$/, message: '请输入正确的QQ号', trigger: 'blur' }
  ],
  website: [
    { type: 'url', message: '请输入正确的网站地址', trigger: 'blur' }
  ],
  github: [
    { pattern: /^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/, message: '请输入正确的GitHub地址', trigger: 'blur' }
  ],
  address: [
    { max: 255, message: '地址长度不能超过255个字符', trigger: 'blur' }
  ]
};

// 禁用未来日期
const disabledDate = (current: dayjs.Dayjs) => {
  return current && current > dayjs().endOf('day');
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    username: userInfo.value.username || '',
    nickname: userInfo.value.nickname || '',
    email: userInfo.value.email || '',
    phone: userInfo.value.phone || '',
    gender: userInfo.value.gender || 0,
    birthday: userInfo.value.birthday ? dayjs(userInfo.value.birthday) : null,
  });
};

// 重置资料表单
const resetProfileForm = async () => {
  await fetchUserProfile();
};

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await userApi.getCurrentUser();
    userInfo.value = response.data;

    // 更新表单数据
    Object.assign(formData, {
      username: response.data.username,
      nickname: response.data.nickname || '',
      email: response.data.email,
      phone: response.data.phone || '',
      gender: response.data.gender || 0,
      birthday: response.data.birthday ? dayjs(response.data.birthday) : null,
    });
  } catch {
    message.error('获取用户信息失败');
  }
};

// 获取用户资料
const fetchUserProfile = async () => {
  try {
    const response = await userApi.getCurrentUserProfile();
    if (response.data) {
      Object.assign(profileData, response.data);
    }
  } catch {
    console.log('用户资料不存在，将创建新资料');
  }
};

// 获取用户统计
const fetchUserStats = async () => {
  try {
    const response = await userApi.getCurrentUserStats();
    userStats.value = response.data;
  } catch {
    message.error('获取用户统计失败');
  }
};

// 初始化数据
const initData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchUserInfo(),
      fetchUserProfile(),
      fetchUserStats()
    ]);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initData();
});

const handleSave = async () => {
  try {
    saving.value = true;

    // 构建更新数据
    const updateData: Partial<User> = {
      nickname: formData.nickname,
      phone: formData.phone,
      gender: formData.gender,
      birthday: formData.birthday ? formData.birthday.format('YYYY-MM-DD') : undefined,
    };

    const response = await userApi.updateCurrentUser(updateData);
    userInfo.value = { ...userInfo.value, ...response.data };

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

    // 构建资料数据
    const profileUpdateData: UserProfile = {
      userId: userInfo.value.id || 0,
      realName: profileData.realName || '',
      education: profileData.education || '',
      profession: profileData.profession || '',
      company: profileData.company || '',
      bio: profileData.bio || '',
      learningGoals: profileData.learningGoals || '',
      interests: profileData.interests || [],
      wechat: profileData.wechat || '',
      qq: profileData.qq || '',
      website: profileData.website || '',
      github: profileData.github || '',
      address: profileData.address || ''
    };

    await userApi.updateCurrentUserProfile(profileUpdateData);
    message.success('详细资料更新成功');
  } catch {
    message.error('详细资料更新失败');
  } finally {
    profileSaving.value = false;
  }
};

const handleAvatarClick = () => {
  // 创建文件输入元素
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        // 检查文件大小（限制为2MB）
        if (file.size > 2 * 1024 * 1024) {
          message.error('图片大小不能超过2MB');
          return;
        }

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
          message.error('请选择图片文件');
          return;
        }

        const response = await userApi.uploadAvatar(file);
        userInfo.value.avatarUrl = response.data;
        message.success('头像上传成功');
      } catch {
        message.error('头像上传失败');
      }
    }
  };
  input.click();
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

// 格式化学习时长
const formatStudyTime = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}分钟`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 ? `${days}天${remainingHours}小时` : `${days}天`;
  }
};

// 图表数据
const chartData = computed(() => ({
  labels: ['已完成课程', '进行中课程', '未开始课程'],
  datasets: [{
    data: [
      userStats.value.completedCourses || 0,
      (userStats.value.enrolledCourses || 0) - (userStats.value.completedCourses || 0),
      Math.max(0, 10 - (userStats.value.enrolledCourses || 0)) // 假设总共有10门推荐课程
    ],
    backgroundColor: [
      '#52c41a',
      '#1890ff',
      '#f5f5f5'
    ],
    borderWidth: 0,
    hoverOffset: 4
  }]
}));

// 图表选项
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 20,
        usePointStyle: true,
        font: {
          size: 12
        }
      }
    },
    tooltip: {
      callbacks: {
        label: function(context: { label: string; parsed: number; dataset: { data: number[] } }) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    }
  }
}));
</script>

<style scoped>
.profile-container {
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.profile-header {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.avatar-section {
  text-align: center;
  margin-right: 32px;
  position: relative;
  z-index: 1;
}

.avatar-section .ant-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.avatar-section .ant-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.avatar-section .ant-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.user-info {
  position: relative;
  z-index: 1;
}

.user-info h2 {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-role {
  margin: 12px 0;
}

.user-role .ant-tag {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  font-weight: 500;
}

.user-email {
  color: rgba(255, 255, 255, 0.9);
  margin: 8px 0;
  font-size: 16px;
}

.join-time {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 8px 0;
}

.ant-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
}

.ant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.ant-card .ant-card-head {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: none;
  padding: 16px 24px;
}

.ant-card .ant-card-head-title {
  font-weight: 600;
  font-size: 16px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 20px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px;
}

.level-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(255, 107, 107, 0.3);
  position: relative;
  overflow: hidden;
}

.level-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
}

.level-number {
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.level-text {
  font-size: 14px;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.points-info {
  flex: 1;
}

.points-info p {
  margin: 8px 0;
  color: #2c3e50;
  font-size: 15px;
  font-weight: 500;
}

.exam-stats {
  text-align: center;
}

.exam-stat {
  padding: 16px;
  background: linear-gradient(135deg, #48cae4 0%, #0077b6 100%);
  border-radius: 12px;
  color: white;
  transition: all 0.3s ease;
}

.exam-stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(72, 202, 228, 0.3);
}

.exam-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.exam-label {
  font-size: 13px;
  opacity: 0.9;
  font-weight: 500;
}

.average-score {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
  border-radius: 12px;
  color: #2d3436;
  font-weight: 600;
}

.score {
  font-size: 20px;
  font-weight: 700;
  color: #e17055;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
