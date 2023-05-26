import ApiService from './ApiService'

export default class DashboardService {
  static async getData() {
    try {
      return await ApiService.get('dashboard-data')
    } catch (Error) {
      return Error
    }
  }
}
