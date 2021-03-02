import axios from '../../src'
import 'nprogress/nprogress.css'
import NProgress from 'nprogress'

const instance = axios.create()

const update = (e: ProgressEvent) => {
  console.log(e)
  NProgress.set(calculatePercentage(e.loaded, e.total))
}

instance.defaults.onDownloadProgress = update
instance.defaults.onUploadProgress = update

instance.interceptors.request.use(config => {
  NProgress.start()
  return config
})

instance.interceptors.response.use(response => {
  NProgress.done()
  return response
}, error => {
  NProgress.done()
  return Promise.reject(error)
})

function calculatePercentage(loaded: number, total: number) {
  return Math.floor(loaded * 10) / total
}

const downloadEl = document.getElementById('download')

const downloadFileURL = 'https://img.mukewang.com/5cc01a7b0001a33718720632.gif'

// @ts-ignore
downloadEl.addEventListener('click', e => {
  instance.get(downloadFileURL)
    .then(res => {
      console.log(`download file success, data.length: ${res.data.length}, data.url: ${res.config.url}`)
    })
})

const uploadEl = document.getElementById('upload')

// @ts-ignore
uploadEl.addEventListener('click', e => {
  const data = new FormData()
  const fileEl = document.getElementById('file') as HTMLInputElement
  if (fileEl.files) {
    data.append('file', fileEl.files[0])
    instance.post('/upload-download/upload', data).then(() => {
        console.log('upload file success, you can see it on ./exapmles/accept-upload-file')
      })
  }
})
