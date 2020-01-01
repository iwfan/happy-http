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
        .request<HttpResponse<{ args: object }>>({
          url: '/get',
          params: {
            qux: ['baz', 'foo'],
            date: new Date('2020-01-01 00:00:00')
          }
        })
        .then(response => {
          // @ts-ignore
          expect(response.data.args).toEqual({
            foo: 'bar',
            qux: ['baz', 'foo'],
            date: '2019-12-31T16:00:00.000Z'
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
          // @ts-ignore
          expect(data.data.headers).toEqual(
            expect.objectContaining({
              'Content-Encoding': 'UTF-8, gbk',
              'X-Custom-Header-1': 'custom_header1'
            })
          );
          expect(data.headers.get('Content-Type')).toBe('application/json');
        });
    });

    it('should send string http request body to server', () => {
      happy = new HappyHttp();
      return happy
        .request<{ headers: object; data: any }>({
          method: 'post',
          url: 'http://httpbin.org/post',
          data: 'test_body'
        })
        .then(response => {
          expect(response.data.headers).toEqual(
            expect.objectContaining({ 'Content-Type': 'text/plain' })
          );
          expect(response.data.data).toBe('test_body');
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
});
