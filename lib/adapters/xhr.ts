import { HttpClientAdapter } from './adapter';
import { HttpRequest } from '../core/http_request';
import { HttpResponse } from '../core/http_response';
import { isString, isNumber, isBoolean } from '../helpers';
import { HttpHeaders } from '../core/http_headers';

export default class XHRAdapter implements HttpClientAdapter {
  setHeaders(xhr: XMLHttpRequest, headers: HttpHeaders) {
    Object.entries(headers.getAll()).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
  }

  send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
    return new Promise<HttpResponse<T>>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(request.method, request.url);

      this.setHeaders(xhr, request.headers);

      xhr.responseType = request.responseType;

      if (isNumber(request.timeout)) {
        xhr.timeout = request.timeout;
      }

      if (isBoolean(request.withCredentials) && request.withCredentials) {
        xhr.withCredentials = true;
      }

      xhr.onload = () => {
        const response = new HttpResponse<T>(
          xhr.status,
          xhr.statusText,
          xhr.responseType === 'text' ? xhr.responseText : xhr.response,
          new HttpHeaders(),
          request
        );

        if ((200 <= xhr.status && xhr.status < 300) || xhr.status === 304) {
          resolve(response);
        } else {
          reject(response);
        }
      };

      xhr.onerror = () => {
        reject(new Error(`NetWork Error.`));
      };

      xhr.ontimeout = () => {
        reject(new Error(`Timeout Error.`));
      };

      xhr.send(request.serializeBody());
    });
  }
}
