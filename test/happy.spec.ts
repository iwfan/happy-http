import HappyHttp from '../src/happy';

describe('HappyHttp test', () => {
  let happy: HappyHttp;

  beforeEach(() => {
    happy = new HappyHttp();
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
});
