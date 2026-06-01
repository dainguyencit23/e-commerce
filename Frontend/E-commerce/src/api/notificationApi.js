import { privateClient } from './axiosInstance.js'

const notificationApi = {
  getAll:       () => privateClient.get('/notifications'),
  getUnreadCount: () => privateClient.get('/notifications/unread-count'),
  markAsRead:   (id) => privateClient.patch(`/notifications/${id}/read`),
  markAllAsRead: () => privateClient.patch('/notifications/read-all'),
}

export default notificationApi
