<template>
  <div class="app-navigation">
    <a-menu
      v-model:selectedKeys="selectedKeys"
      mode="horizontal"
      :style="{ lineHeight: '64px' }"
      @click="handleMenuClick"
    >
      <a-menu-item key="/profile">
        <UserOutlined />
        个人中心
      </a-menu-item>
      <a-menu-item key="/courses">
        <BookOutlined />
        我的课程
      </a-menu-item>
      <a-menu-item key="/catalog">
        <AppstoreOutlined />
        课程目录
      </a-menu-item>
      <a-menu-item key="/notes">
        <EditOutlined />
        学习笔记
      </a-menu-item>
      <a-sub-menu key="user">
        <template #title>
          <a-avatar :size="32" :src="userInfo?.avatarUrl">
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <span style="margin-left: 8px;">{{ userInfo?.nickname || userInfo?.username }}</span>
        </template>
        <a-menu-item key="/settings">
          <SettingOutlined />
          设置
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout">
          <LogoutOutlined />
          退出登录
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import {
  UserOutlined,
  BookOutlined,
  AppstoreOutlined,
  EditOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';

const router = useRouter();
const route = useRoute();

interface UserInfo {
  id: number;
  username: string;
  nickname?: string;
  avatarUrl?: string;
  email: string;
}

const userInfo = ref<UserInfo | null>(null);

const selectedKeys = computed(() => {
  const path = route.path;
  if (path.startsWith('/courses')) {
    return ['/courses'];
  }
  return [path];
});

const handleMenuClick = ({ key }: { key: string }) => {
  if (key === 'logout') {
    handleLogout();
  } else {
    router.push(key);
  }
};

const handleLogout = () => {
  Modal.confirm({
    title: '确认退出',
    content: '您确定要退出登录吗？',
    okText: '确定',
    cancelText: '取消',
    onOk() {
      // 清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userInfo');
      
      message.success('已退出登录');
      router.push('/login');
    },
  });
};

const loadUserInfo = () => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    try {
      userInfo.value = JSON.parse(userInfoStr);
    } catch (error) {
      console.error('解析用户信息失败:', error);
    }
  }
};

onMounted(() => {
  loadUserInfo();
});
</script>

<style scoped>
.app-navigation {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-navigation .ant-menu {
  border-bottom: none;
}

.app-navigation .ant-menu-horizontal {
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.app-navigation .ant-menu-submenu {
  margin-left: auto;
}
</style>
