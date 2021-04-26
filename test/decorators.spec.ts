import { Api } from '../lib/decorators/decorators'

describe('As Api', () => {
  it('should send request successful', () => {
    return Api.getUser<{ data: object }>().then(data => {
      expect(data).toBeTruthy()
    })
  })
})
