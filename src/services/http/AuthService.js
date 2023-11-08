import ApiService from './ApiService'

export default class AuthService {
  static async register(params) {
    try {
      return await ApiService.post('register/', params)
    } catch (Error) {
      return Error.response
    }
  }
  static async login(params) {
    try {
      return await ApiService.post('login/', params)
    } catch (Error) {
      return Error.response
    }
  }
}
