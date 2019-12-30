import { Api } from '../lib/decorators/decorators';

describe('As Api', () => {
  it('should send request successful', () => {
    // @ts-ignore
    return Api.getUser().then(data => {
      expect(data).toBe(1);
    });
  });
});
