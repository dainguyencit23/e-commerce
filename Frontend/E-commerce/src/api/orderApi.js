import { privateClient } from './axiosInstance.js'

const orderApi = {
  create:       (data) => privateClient.post('/orders', data),
  getAll:       ()     => privateClient.get('/orders'),
  getMyOrders:  (params)     => privateClient.get('/orders/my', { params }),
  getById:      (id)   => privateClient.get(`/orders/${id}`),
  updateStatus: (id, data) => privateClient.put(`/orders/${id}/status`, data),
  cancel:       (id)   => privateClient.put(`/orders/${id}/cancel`)
}
export default orderApi
