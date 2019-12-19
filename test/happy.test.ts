import HapppyHttp from '../src/happy'

describe('HapppyHttp test', () => {
  let happy: HapppyHttp

  beforeEach(() => {
    happy = new HapppyHttp()
  })

  it('should can send http request', () => {
    return happy
      .request({
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/users',
        params: {}
      })
      .then(data => {
        expect(data).toBeTruthy()
      })
  })
})
