import { isValidHttpMethod, isValidHttpUrl } from '../src/validators';
import { HttpMethods } from '../src/types';

describe('As Validators', () => {
  describe('As isValidHttpMethod', () => {
    it('should return true when given "GET"', () => {
      expect(isValidHttpMethod('GET')).toBe(true);
    });
    it('should return true when given "DELETE"', () => {
      expect(isValidHttpMethod('DELETE')).toBe(true);
    });
    it('should return true when given null', () => {
      expect(isValidHttpMethod((null as unknown) as HttpMethods)).toBe(false);
    });
    it('should return true when given "TRACE"', () => {
      expect(isValidHttpMethod(('TRACE' as unknown) as HttpMethods)).toBe(
        false
      );
    });
  });

  describe('As isValidHttpUrl', () => {
    it('should return true when given a string', () => {
      expect(isValidHttpUrl('/path/to/resource')).toBe(true);
    });
    it('should return true when given a blank string', () => {
      expect(isValidHttpUrl('')).toBe(false);
    });
  });
});
