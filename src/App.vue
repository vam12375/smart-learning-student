<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import AppNavigation from '@/components/AppNavigation.vue'

const route = useRoute()

// 不显示导航的页面
const hideNavigation = computed(() => {
  const hideNavRoutes = ['/login', '/register']
  return hideNavRoutes.includes(route.path)
})
</script>

<template>
  <div id="app">
    <AppNavigation v-if="!hideNavigation" />
    <RouterView />
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
}

/* 全局动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

/* 卡片悬停效果 */
.card-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 按钮动画 */
.ant-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ant-btn:hover {
  transform: translateY(-1px);
}

/* 加载动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* 渐变文字 */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr !important;
  }

  .course-header {
    flex-direction: column !important;
    text-align: center;
  }

  .course-cover {
    width: 100% !important;
    height: 200px !important;
  }

  .sidebar {
    width: 100% !important;
  }
}

@media (max-width: 480px) {
  .app-navigation .ant-menu-horizontal {
    padding: 0 12px !important;
  }

  .courses-container,
  .profile-container {
    padding: 12px !important;
  }
}
</style>
