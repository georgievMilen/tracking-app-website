import dayjs from 'dayjs'
import DashboardService from '../http/DashboardService'
export default {
  async getDashData() {
    const now = dayjs()
    const expiry = window.localStorage.getItem('dash_config_data_expiry')

    if (expiry && now < expiry) {
      return JSON.parse(window.localStorage.getItem('dash_config_data'))
    }

    await DashboardService.getData().then((response) => {
      console.log({ response })
      window.localStorage.setItem('dash_config_data', JSON.stringify(response))

      window.localStorage.setItem('dash_config_data_expiry', dayjs().add(2, 'hour').valueOf().toString())

      return response
    })
  },
}
