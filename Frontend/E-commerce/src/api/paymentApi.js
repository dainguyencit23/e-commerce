import { privateClient } from './axiosInstance.js'

const paymentApi = {
  createVNPay: (data) => privateClient.post('/payment/vnpay/create', data),
}

export default paymentApi
