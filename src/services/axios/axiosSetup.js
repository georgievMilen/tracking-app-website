import Axios from 'axios'

Axios.defaults.baseURL = 'https://api.tracking-app.test/'
Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
Axios.defaults.headers.common.Accept = 'application/json'

export default Axios
