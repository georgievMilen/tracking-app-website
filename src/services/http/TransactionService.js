import ApiService from './ApiService'

export default class TransactionService {
  static url = 'transactions/'
  static async list(params) {
    try {
      return await ApiService.get(this.url, params)
    } catch (Error) {
      return Error
    }
  }

  static async create(data) {
    try {
      return await ApiService.post(this.url, data)
    } catch (Error) {
      return Error
    }
  }

  static async update(uuid, data) {
    try {
      return await ApiService.put(this.url + uuid, data)
    } catch (Error) {
      return Error
    }
  }

  static async delete(uuid) {
    try {
      return await ApiService.delete(this.url + uuid)
    } catch (Error) {
      return Error
    }
  }
}
