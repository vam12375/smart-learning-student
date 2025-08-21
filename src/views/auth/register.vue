<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h1>智能学习平台</h1>
        <p>学生注册</p>
      </div>
      
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        @finish="handleRegister"
        layout="vertical"
      >
        <a-form-item name="username" label="用户名">
          <a-input
            v-model:value="formData.username"
            size="large"
            placeholder="请输入用户名"
            @blur="checkUsername"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="email" label="邮箱">
          <a-input
            v-model:value="formData.email"
            size="large"
            placeholder="请输入邮箱地址"
            @blur="checkEmail"
          >
            <template #prefix>
              <MailOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="nickname" label="昵称">
          <a-input
            v-model:value="formData.nickname"
            size="large"
            placeholder="请输入昵称（可选）"
          >
            <template #prefix>
              <UserOutlined />
            </template>
          </a-input>
        </a-form-item>
        
        <a-form-item name="phone" label="手机号">
          <a-input
            v-model:value="formData.phone"
            size="large"
            placeholder="请输入手机号（可选）"
          >
            <template #prefix>
              <PhoneOutlined />
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
        
        <a-form-item name="confirmPassword" label="确认密码">
          <a-input-password
            v-model:value="formData.confirmPassword"
            size="large"
            placeholder="请再次输入密码"
          >
            <template #prefix>
              <LockOutlined />
            </template>
          </a-input-password>
        </a-form-item>
        
        <a-form-item>
          <a-checkbox v-model:checked="agreeTerms">
            我已阅读并同意
            <a @click="showTerms">《用户协议》</a>
            和
            <a @click="showPrivacy">《隐私政策》</a>
          </a-checkbox>
        </a-form-item>
        
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="loading"
            :disabled="!agreeTerms"
          >
            注册
          </a-button>
        </a-form-item>
        
        <a-form-item>
          <div class="login-link">
            已有账号？
            <a @click="goToLogin">立即登录</a>
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
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons-vue';
import { userApi } from '@/api/user';
import type { RegisterRequest } from '@/api/user';

const router = useRouter();
const formRef = ref();
const loading = ref(false);
const agreeTerms = ref(false);

const formData = reactive<RegisterRequest>({
  username: '',
  email: '',
  nickname: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string) => {
        if (value && value !== formData.password) {
          return Promise.reject('两次输入的密码不一致');
        }
        return Promise.resolve();
      },
      trigger: 'blur',
    },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
  ],
};

const checkUsername = async () => {
  if (formData.username) {
    try {
      const response = await userApi.checkUsername(formData.username);
      if (!response.data) {
        message.error('用户名已被使用');
      }
    } catch (error) {
      console.error('检查用户名失败:', error);
    }
  }
};

const checkEmail = async () => {
  if (formData.email) {
    try {
      const response = await userApi.checkEmail(formData.email);
      if (!response.data) {
        message.error('邮箱已被注册');
      }
    } catch (error) {
      console.error('检查邮箱失败:', error);
    }
  }
};

const handleRegister = async () => {
  try {
    loading.value = true;
    await userApi.register(formData);
    message.success('注册成功，请登录');
    router.push('/login');
  } catch (error) {
    message.error('注册失败，请检查输入信息');
  } finally {
    loading.value = false;
  }
};

const showTerms = () => {
  message.info('用户协议内容');
};

const showPrivacy = () => {
  message.info('隐私政策内容');
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 16px;
}

.login-link {
  text-align: center;
  color: #666;
}

.login-link a {
  color: #1890ff;
  text-decoration: none;
  cursor: pointer;
}

.login-link a:hover {
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

:deep(.ant-checkbox-wrapper a) {
  color: #1890ff;
  text-decoration: none;
}

:deep(.ant-checkbox-wrapper a:hover) {
  text-decoration: underline;
}
</style>
