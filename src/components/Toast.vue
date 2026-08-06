<template>
  <teleport to="body">
    <transition-group name="toast-list" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="[`toast--${toast.type}`, { 'toast--dismissing': toast.dismissing }]"
        @click="removeToast(toast.id)"
      >
        <span class="toast__icon">{{ getIcon(toast.type) }}</span>
        <span class="toast__message">{{ toast.message }}</span>
        <button class="toast__close" @click.stop="removeToast(toast.id)">×</button>
      </div>
    </transition-group>
  </teleport>
</template>

<script setup>
import { toastState } from '@/utils/toast'

const toasts = toastState.toasts

function getIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}

function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value[index].dismissing = true
    setTimeout(() => {
      toasts.value.splice(index, 1)
    }, 300)
  }
}
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    left: 20px;
    right: 20px;
    top: 80px;
  }
}

.toast {
  min-width: 300px;
  max-width: 500px;
  padding: 16px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    min-width: auto;
    max-width: none;
  }
  
  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  
  &__icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  &__message {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;
    color: #333;
  }
  
  &__close {
    width: 20px;
    height: 20px;
    border: none;
    background: none;
    font-size: 20px;
    line-height: 1;
    color: #999;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    &:hover {
      color: #333;
    }
  }
  
  // 成功样式
  &--success {
    border-left: 4px solid #4caf50;
    
    .toast__icon {
      background-color: #e8f5e9;
      color: #4caf50;
    }
  }
  
  // 错误样式
  &--error {
    border-left: 4px solid #f44336;
    
    .toast__icon {
      background-color: #ffebee;
      color: #f44336;
    }
  }
  
  // 警告样式
  &--warning {
    border-left: 4px solid #ff9800;
    
    .toast__icon {
      background-color: #fff3e0;
      color: #ff9800;
    }
  }
  
  // 信息样式
  &--info {
    border-left: 4px solid #2196f3;
    
    .toast__icon {
      background-color: #e3f2fd;
      color: #2196f3;
    }
  }
  
  &--dismissing {
    opacity: 0;
    transform: translateX(400px);
  }
}

// 动画
.toast-list-enter-active {
  animation: toast-in 0.3s ease;
}

.toast-list-leave-active {
  animation: toast-out 0.3s ease;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(400px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(400px) scale(0.9);
  }
}
</style>
