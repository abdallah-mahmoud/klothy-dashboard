<template>
  <div class="skeleton-wrapper">
    <!-- Table Skeleton -->
    <div v-if="type === 'table'" class="skeleton-table">
      <div v-for="i in rows" :key="i" class="skeleton-row">
        <div v-for="j in columns" :key="j" class="skeleton-cell" />
      </div>
    </div>

    <!-- Card Skeleton -->
    <div v-if="type === 'card'" class="skeleton-card">
      <div class="skeleton-avatar" />
      <div class="skeleton-content">
        <div class="skeleton-line" />
        <div class="skeleton-line short" />
      </div>
    </div>

    <!-- KPI Skeleton -->
    <div v-if="type === 'kpi'" class="skeleton-kpi">
      <div class="skeleton-avatar-circle" />
      <div class="skeleton-text-group">
        <div class="skeleton-value" />
        <div class="skeleton-label" />
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-if="type === 'list'" class="skeleton-list">
      <div v-for="i in rows" :key="i" class="skeleton-list-item">
        <div class="skeleton-avatar-small" />
        <div class="skeleton-list-content">
          <div class="skeleton-line" />
          <div class="skeleton-line short" />
        </div>
      </div>
    </div>

    <!-- Chart Skeleton -->
    <div v-if="type === 'chart'" class="skeleton-chart">
      <div class="skeleton-chart-bars">
        <div v-for="i in 7" :key="i" class="skeleton-bar" :style="{ height: `${Math.random() * 80 + 20}%` }" />
      </div>
      <div class="skeleton-chart-labels">
        <div v-for="i in 7" :key="i" class="skeleton-label-small" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'table' | 'card' | 'kpi' | 'list' | 'chart'
  rows?: number
  columns?: number
}

withDefaults(defineProps<Props>(), {
  type: 'table',
  rows: 5,
  columns: 4
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-wrapper {
  width: 100%;
}

/* Base skeleton styles */
.skeleton-cell,
.skeleton-line,
.skeleton-avatar,
.skeleton-avatar-circle,
.skeleton-avatar-small,
.skeleton-value,
.skeleton-label,
.skeleton-label-small,
.skeleton-bar {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 4px;
}

/* Table Skeleton */
.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  display: flex;
  gap: 16px;
}

.skeleton-cell {
  flex: 1;
  height: 40px;
  min-width: 80px;
}

/* Card Skeleton */
.skeleton-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.skeleton-avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  flex-shrink: 0;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-line {
  height: 16px;
  width: 100%;
}

.skeleton-line.short {
  width: 60%;
}

/* KPI Skeleton */
.skeleton-kpi {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
}

.skeleton-avatar-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-text-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-value {
  height: 32px;
  width: 80px;
}

.skeleton-label {
  height: 16px;
  width: 120px;
}

/* List Skeleton */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.skeleton-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.skeleton-list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Chart Skeleton */
.skeleton-chart {
  padding: 16px;
}

.skeleton-chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  gap: 8px;
  margin-bottom: 12px;
}

.skeleton-bar {
  flex: 1;
  max-width: 40px;
  border-radius: 4px 4px 0 0;
}

.skeleton-chart-labels {
  display: flex;
  justify-content: space-around;
  gap: 8px;
}

.skeleton-label-small {
  height: 12px;
  width: 40px;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .skeleton-cell,
  .skeleton-line,
  .skeleton-avatar,
  .skeleton-avatar-circle,
  .skeleton-avatar-small,
  .skeleton-value,
  .skeleton-label,
  .skeleton-label-small,
  .skeleton-bar {
    animation: none;
    background: #f0f0f0;
  }
}
</style>
