<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>智能学习平台</h1>
        <p>学生登录</p>
      </div>
      
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        @finish="handleLogin"
        layout="vertical"
      >
        <a-form-item name="username" label="用户名">
          <a-input
            v-model:value="formData.username"
            size="large"
            placeholder="请输入用户名或邮箱"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="password" label="密码">
          <a-input-password
            v-model:value="formData.password"
            size="large"
            placeholder="请输入密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-checkbox v-model:checked="rememberMe">记住我</a-checkbox>
          <a class="forgot-password" @click="handleForgotPassword">忘记密码？</a>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
        
        <a-form-item>
          <div class="register-link">
            还没有账号？
            <a @click="goToRegister">立即注册</a>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { userApi } from '@/api/user';
import type { LoginRequest } from '@/api/user';

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const rememberMe = ref(false);

const formData = reactive<LoginRequest>({
  username: '',
  password: '',
});

const rules = {
  username: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
};

const handleLogin = async () => {
  try {
    loading.value = true;
    const response = await userApi.login(formData);
    
    // 保存登录信息
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
    
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true');
    }
    
    message.success('登录成功');
    router.push('/profile');
  } catch (error) {
    message.error('登录失败，请检查用户名和密码');
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = () => {
  message.info('请联系管理员重置密码');
};

const goToRegister = () => {
  router.push('/register');
};

// 检查是否已登录
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/profile');
  }
};

// 组件挂载时检查登录状态
checkLoginStatus();
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 16px;
}

.forgot-password {
  float: right;
  color: #1890ff;
}

.register-link {
  text-align: center;
  color: #666;
}

.register-link a {
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
}

.register-link a:hover {
  text-decoration: underline;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
}

:deep(.ant-btn) {
  border-radius: 8px;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}
</style>
