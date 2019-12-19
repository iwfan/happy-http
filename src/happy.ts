import { HappyHttpInterface, HappyHttpOptions } from './types'

export default class HappyHttp implements HappyHttpInterface {
  request<T>(options: HappyHttpOptions) {
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (200 <= xhr.status || xhr.status < 300) {
            resolve(xhr.response)
          } else {
            reject(xhr.response)
          }
        }
      }
      xhr.open(options.method, options.url)
      xhr.send()
    })
  }
}
