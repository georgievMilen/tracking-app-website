import Axios from '/src/services/axios/axiosSetup.js'

export default class ApiService {
  static async request(url, method = 'get', data = null, config = {}) {
    const response = await Axios[method]('/' + url, data, config)

    if (!response.data && !response.details) {
      return {}
    } else if ('data' in response.data) {
      return response.data.data
    } else {
      return response.data.details
    }
  }

  static async get(url, params = null) {
    return this.request(url, 'get', { params })
  }

  static async post(url, data = null) {
    return this.request(url, 'post', data)
  }

  static async delete(url, data = null) {
    return this.request(url, 'delete', data)
  }

  static async put(url, data = null) {
    return this.request(url, 'put', data)
  }
}
