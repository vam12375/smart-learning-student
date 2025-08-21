<template>
  <div class="learning-chart">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  DoughnutController,
  LineController,
  BarController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  DoughnutController,
  LineController,
  BarController
);

interface Props {
  type: 'line' | 'doughnut' | 'bar';
  data: any;
  options?: any;
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({})
});

const chartRef = ref<HTMLCanvasElement>();
let chartInstance: ChartJS | null = null;

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          weight: '500'
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      padding: 12
    }
  },
  scales: props.type !== 'doughnut' ? {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  } : undefined
};

const createChart = () => {
  if (!chartRef.value) return;

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  // 销毁现有图表
  if (chartInstance) {
    chartInstance.destroy();
  }

  const mergedOptions = {
    ...defaultOptions,
    ...props.options
  };

  chartInstance = new ChartJS(ctx, {
    type: props.type,
    data: props.data,
    options: mergedOptions
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });

watch(() => props.type, () => {
  createChart();
});
</script>

<style scoped>
.learning-chart {
  position: relative;
  height: 300px;
  width: 100%;
}

canvas {
  max-height: 100%;
  max-width: 100%;
}
</style>
