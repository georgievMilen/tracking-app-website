import ApiService from './ApiService'

export default class CategoryService {
  static async list() {
    try {
      return await ApiService.get('categories')
    } catch (Error) {
      return Error
    }
  }
}
