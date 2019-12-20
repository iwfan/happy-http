import HappyHttp from '../happy';

describe('HappyHttp test', () => {
  let happy: HappyHttp;

  beforeEach(() => {
    happy = new HappyHttp();
  });

  describe('Basic', () => {
    it('should throw invalid method when given empty method', () => {
      expect(() => happy.request({})).toThrow(
        new TypeError(`Invalid HTTP method: undefined`)
      );
    });

    it('should throw invalid url when given empty url', () => {
      expect(() => happy.request({ method: 'get' })).toThrow(
        new TypeError(`Invalid HTTP url: undefined`)
      );
    });

    it('should can send http request', () => {
      return happy
        .request({
          method: 'get',
          url: 'http://httpbin.org/'
        })
        .then(data => {
          expect(data).toBeTruthy();
        });
    });

    it('should auto parse text of response body', () => {
      return happy
        .request({
          method: 'get',
          url: 'http://httpbin.org/get'
        })
        .then(data => {
          expect(typeof data).not.toBe('string');
        });
    });
  });

  describe('Send params', () => {
    it('should can send params', () => {
      const date = new Date();
      return happy
        .request<{ args: object }>({
          method: 'get',
          url: 'http://httpbin.org/get',
          params: {
            foo: 'bar',
            date,
            bar: ['baz', 'qux']
          }
        })
        .then(data => {
          expect(data.args).toEqual({
            foo: 'bar',
            date: date.toISOString(),
            'bar[]': ['baz', 'qux']
          });
        });
    });
  });
});
