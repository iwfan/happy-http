import { HttpUrlSerializer } from '../src/http_url_serializer';

describe('As a UrlSerializer', () => {

  const serializer = new HttpUrlSerializer();

  it('should throw exception when give url is not a string', () => {
    expect(() => serializer.serialize(undefined as unknown as string))
      .toThrowError(new TypeError('"url" is not a string'));
  });

  it('should return raw url when given url is not includes hash', () => {
    const url = 'http://localhost:3000/abc';
    expect(serializer.serialize(url)).toBe(url);
  });

  it('should remove hash when given url includes hash', () => {
    const url = 'http://localhost:3000/abc#def';
    expect(serializer.serialize(url)).toBe('http://localhost:3000/abc');
  });

  it('should serialize the string params', () => {
    const url = 'http://example.com';
    expect(serializer.serialize(url, { foo: 'bar', baz: 'qux' }))
      .toBe('http://example.com?foo=bar&baz=qux')
  });

  it('should serialize the array params', () => {
    const url = 'http://example.com';
    expect(serializer.serialize(url, { foo: ['bar', 'baz', 'qux'] }))
      .toBe('http://example.com?foo=bar&foo=baz&foo=qux')
  });


  it('should serialize the date params', () => {
    const url = 'http://example.com';
    const date = new Date();
    expect(serializer.serialize(url, { foo: date }))
      .toBe(`http://example.com?foo=${date.toISOString()}`)
  });

  it('should serialize the object params', () => {
    const url = 'http://example.com';
    expect(serializer.serialize(url, { foo: { bar: 'baz', qux: 'qux' } }))
      .toBe('http://example.com?foo={%22bar%22:%22baz%22,%22qux%22:%22qux%22}')
  });

  it('should do not escape some special characters', () => {
    const url = 'http://example.com';
    expect(serializer.serialize(url, { foo: [new Object()], baz: '@:$, []' }))
      .toBe(`http://example.com?foo=[object+Object]&baz=@:$,+[]`)
  });

  it('should do not escape some special characters', () => {
    const url = 'http://example.com#hash';
    expect(serializer.serialize(url, { foo: ['bar'], baz: '@:$, []{}' }))
      .toBe(`http://example.com?foo=bar&baz=@:$,+[]{}`)
  });

});
