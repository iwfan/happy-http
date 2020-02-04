import HappyHttp from '../lib/core/happy_http';
import { HttpRequest } from '../lib/core/http_request';
import { HttpResponse } from '../lib/core/http_response';

describe('HappyHttp test', () => {
  let happy: HappyHttp;

  beforeEach(() => {
    happy = new HappyHttp();
  });

  describe('Basic', () => {
    it('should throw invalid url when given empty url', () => {
      expect(() => happy.request()).toThrow(new TypeError(`Invalid url: `));
    });

    it('should can send http request', () => {
      return happy
        .request({
          url: 'http://httpbin.org/'
        })
        .then(data => {
          expect(data).toBeTruthy();
        });
    });

    it('should send params to server', () => {
      happy = new HappyHttp(
        new HttpRequest({
          baseUrl: 'http://httpbin.org',
          params: { foo: 'bar' }
        })
      );

      return happy
        .request<{ args: object }>({
          url: '/get',
          params: {
            qux: ['baz', 'foo'],
            info: { a: { b: 'c' } }
          }
        })
        .then(response => {
          expect(response.data.args).toEqual({
            foo: 'bar',
            qux: ['baz', 'foo'],
            info: '{"a":{"b":"c"}}'
          });
        });
    });

    it('should send http headers to server', () => {
      happy = new HappyHttp({
        baseUrl: 'http://httpbin.org/get',
        headers: { 'Content-Encoding': ['UTF-8', 'gbk'] }
      });

      return happy
        .request<{ headers: {} }>(
          new HttpRequest({
            headers: {
              'X-CUSTOM-HEADER-1': 'custom_header1'
            }
          })
        )
        .then(data => {
          expect(data.data.headers).toEqual(
            expect.objectContaining({
              'Content-Encoding': 'UTF-8, gbk',
              'X-Custom-Header-1': 'custom_header1'
            })
          );
          expect(data.headers.get('Content-Type')).toBe('application/json');
        });
    });

    it('should send number http request body to server', () => {
      happy = new HappyHttp();
      return happy
        .request<{ headers: object; data: any }>({
          method: 'post',
          url: 'http://httpbin.org/post',
          data: 0
        })
        .then(response => {
          expect(response.data.headers).toEqual(
            expect.objectContaining({ 'Content-Type': 'application/json' })
          );
          expect(response.data.data).toBe('0');
        });
    });

    it('should send boolean http request body to server', () => {
      happy = new HappyHttp();
      return happy
        .request<{ headers: object; data: any }>({
          method: 'post',
          url: 'http://httpbin.org/post',
          data: false
        })
        .then(response => {
          expect(response.data.headers).toEqual(
            expect.objectContaining({ 'Content-Type': 'application/json' })
          );
          expect(response.data.data).toBe('false');
        });
    });

    it('should send string http request body to server', () => {
      happy = new HappyHttp();
      return happy
        .request<{ headers: object; data: any }>({
          method: 'post',
          url: 'http://httpbin.org/post',
          data: 'Lorem ipsum dolor sit amet'
        })
        .then(response => {
          expect(response.data.headers).toEqual(
            expect.objectContaining({ 'Content-Type': 'text/plain' })
          );
          expect(response.data.data).toBe('Lorem ipsum dolor sit amet');
        });
    });

    it('should send plain object http request body to server', () => {
      happy = new HappyHttp();
      return happy
        .request<{ headers: object; data: any }>({
          method: 'post',
          url: 'http://httpbin.org/post',
          data: { foo: { bar: ['qux', 'baz'] }, bar: 'baz' }
        })
        .then(response => {
          expect(response.data.headers).toEqual(
            expect.objectContaining({ 'Content-Type': 'application/json' })
          );
          expect(response.data.data).toBe(
            '{"foo":{"bar":["qux","baz"]},"bar":"baz"}'
          );
        });
    });

    it('should send form data http request body to server', () => {
      happy = new HappyHttp();
      const formData = new FormData();
      formData.append('foo', 'bar');
      formData.append('file', new Blob(['test data']), 'test.file');
      return happy
        .request<{
          headers: { [index: string]: string };
          form: { [index: string]: string };
          files: { [index: string]: string };
          data: any;
        }>({
          method: 'post',
          url: 'http://httpbin.org/post',
          data: formData
        })
        .then(response => {
          const contentTypeHeader = response.data.headers['Content-Type'];
          expect(contentTypeHeader.startsWith('multipart/form-data'));
          expect(response.data.form['foo']).toBe('bar');
          expect(response.data.files['file']).toBe('test data');
        });
    });

    it('should send blob http request body to server', () => {
      happy = new HappyHttp();
      const formData = new FormData();
      formData.append('foo', 'bar');
      formData.append('file', new Blob(['test data']), 'test.file');
      return happy
        .request<{ data: any }>({
          method: 'post',
          url: 'http://httpbin.org/post',
          data: new Blob(['test data'], { type: 'images/jpeg' })
        })
        .then(response => {
          expect(response.data.data).toBe('test data');
        });
    });

    it('should throw error when server response error', () => {
      happy = new HappyHttp({
        baseUrl: 'http://httpbin.org'
      });
      return happy
        .request<{ headers: object; data: any }>({
          method: 'get',
          url: '/status/404'
        })
        .catch((response: HttpResponse) => {
          expect(response.error).toBe(
            'Http failure response for http://httpbin.org/status/404: 404 NOT FOUND'
          );
        });
    });
  });

  it('should return correct result when invoke get method', async () => {
    const happy = new HappyHttp({ baseUrl: 'http://httpbin.org/' });
    return happy.get<{ method: string }>('anything').then(response => {
      expect(response.data.method).toBe('GET');
    });
  });

  it('should return correct result when invoke delete method', async () => {
    const happy = new HappyHttp({ baseUrl: 'http://httpbin.org/' });
    return happy.delete<{ method: string }>('anything').then(response => {
      expect(response.data.method).toBe('DELETE');
    });
  });

  it('should return correct result when invoke post method', async () => {
    const happy = new HappyHttp({ baseUrl: 'http://httpbin.org/' });
    return happy
      .post<{ method: string; json: any }>('anything', 1)
      .then(response => {
        expect(response.data.method).toBe('POST');
        expect(response.data.json).toBe(1);
      });
  });

  it('should return correct result when invoke put method', async () => {
    const happy = new HappyHttp({ baseUrl: 'http://httpbin.org/' });
    return happy
      .put<{ method: string; json: any }>('anything', 1)
      .then(response => {
        expect(response.data.method).toBe('PUT');
        expect(response.data.json).toBe(1);
      });
  });

  it('should return correct result when invoke patch method', async () => {
    const happy = new HappyHttp({ baseUrl: 'http://httpbin.org/' });
    return happy
      .patch<{ method: string; json: any }>('anything', 1)
      .then(response => {
        expect(response.data.method).toBe('PATCH');
        expect(response.data.json).toBe(1);
      });
  });
});
