import { HappyRequestInterface, HappyHttpOptions } from './types';

export default class HappyXHR implements HappyRequestInterface {
  request<T>(options: HappyHttpOptions): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onerror = () => {
        reject(new Error(`NetWork Error.`));
      };
      xhr.ontimeout = () => {
        reject(new Error(`Timeout Error.`));
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (200 <= xhr.status || xhr.status < 300) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      xhr.open(options.method!, options.url!);
      xhr.send();
    });
  }
}
