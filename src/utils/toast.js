import { ref } from 'vue'

// 全局 toast 状态
export const toastState = {
  toasts: ref([])
}

let toastId = 0

// 显示 toast
function showToast(message, type = 'info', duration = 3000) {
  const id = ++toastId
  
  const toast = {
    id,
    message,
    type,
    dismissing: false
  }
  
  toastState.toasts.value.push(toast)
  
  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
  
  return id
}

// 移除 toast
function removeToast(id) {
  const index = toastState.toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toastState.toasts.value[index].dismissing = true
    setTimeout(() => {
      toastState.toasts.value.splice(index, 1)
    }, 300)
  }
}

// 快捷方法
export const toast = {
  success(message, duration) {
    return showToast(message, 'success', duration)
  },
  error(message, duration) {
    return showToast(message, 'error', duration)
  },
  warning(message, duration) {
    return showToast(message, 'warning', duration)
  },
  info(message, duration) {
    return showToast(message, 'info', duration)
  },
  loading(message) {
    // loading 不自动消失，返回 ID 用于手动关闭
    return showToast(message, 'info', 0)
  },
  dismiss(id) {
    removeToast(id)
  },
  // 确认对话框（替代 confirm）
  confirm(message) {
    return new Promise((resolve) => {
      // 这里可以用模态框实现，暂时用原生 confirm
      resolve(window.confirm(message))
    })
  }
}

// 默认导出
export default toast
