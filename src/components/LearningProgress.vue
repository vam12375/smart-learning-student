<template>
  <div class="learning-progress">
    <div class="progress-header">
      <h3>{{ title }}</h3>
      <span class="progress-value">{{ current }}/{{ total }}</span>
    </div>
    <div class="progress-bar-container">
      <div 
        class="progress-bar" 
        :style="{ width: progressPercentage + '%' }"
        :class="progressClass"
      ></div>
    </div>
    <div class="progress-footer">
      <span class="progress-percentage">{{ progressPercentage }}%</span>
      <span class="progress-description">{{ description }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  current: number;
  total: number;
  description?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  color: 'primary'
});

const progressPercentage = computed(() => {
  if (props.total === 0) return 0;
  return Math.round((props.current / props.total) * 100);
});

const progressClass = computed(() => {
  return `progress-${props.color}`;
});
</script>

<style scoped>
.learning-progress {
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.learning-progress:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.progress-value {
  font-size: 14px;
  font-weight: 600;
  color: #7f8c8d;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.progress-success {
  background: linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%);
}

.progress-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.progress-danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 700;
  color: #2c3e50;
}

.progress-description {
  font-size: 12px;
  color: #7f8c8d;
}
</style>
