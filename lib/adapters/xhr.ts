import { HttpClientAdapter } from './adapter';
import { HttpRequest } from '../core/http_request';
import { HttpResponse } from '../core/http_response';
import { isString } from '../helpers';

export default class XHRAdapter implements HttpClientAdapter {
  send<T, U>(options: HttpRequest): Promise<HttpResponse<U>> {
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
            if (isString(xhr.response)) {
              try {
                resolve(JSON.parse(xhr.response));
              } catch (e) {
                resolve((xhr.response as unknown) as T);
              }
            } else {
              resolve(xhr.response);
            }
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
