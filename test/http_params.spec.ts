import { HttpParams } from '../lib/core/http_params';

describe('As HttpParams', () => {
  it('should construction correct', () => {
    const params = new HttpParams();
    expect(params).toBeTruthy();
    expect(params).toBeInstanceOf(HttpParams);
  });

  it('should be able to serialize string parameters correctly', () => {
    expect(new HttpParams({ foo: 'bar', baz: 'qux' }).serialize()).toBe(
      'foo=bar&baz=qux'
    );
  });

  it('should be able to serialize array parameters correctly', () => {
    expect(new HttpParams({ foo: ['bar', 'baz', 'qux'] }).serialize()).toBe(
      'foo[]=bar&foo[]=baz&foo[]=qux'
    );
  });

  it('should be able to serialize array includes object parameters correctly', () => {
    expect(
      decodeURIComponent(
        new HttpParams({
          foo: ['bar', { foo: 'bar' }, [{ foo: 'bar' }]]
        }).serialize()
      )
    ).toBe('foo[]=bar&foo[]={"foo":"bar"}&foo[]=[{"foo":"bar"}]');
  });

  it('should be able to serialize date parameters correctly', () => {
    const date = new Date();
    expect(new HttpParams({ foo: date }).serialize()).toBe(
      `foo=${date.toISOString()}`
    );
  });

  it('should be able to serialize object parameters correctly', () => {
    expect(
      decodeURIComponent(
        new HttpParams({
          foo: { bar: 'baz', qux: 'qux' }
        }).serialize()
      )
    ).toBe('foo={"bar":"baz","qux":"qux"}');
  });

  it('should be able to serialize special character parameters correctly', () => {
    expect(
      decodeURIComponent(
        new HttpParams({ foo: [{ qux: 'bar' }], baz: '@:$, []' }).serialize()
      )
    ).toBe('foo[]={"qux":"bar"}&baz=@:$,+[]');
  });

  it('should have all params after merge', () => {
    const p1 = new HttpParams({ foo: 'bar' });
    const p2 = new HttpParams({ baz: ['qux', 'foo'] });
    const p3 = { qux: { bar: 'foo' } };
    p1.merge(p2).merge(p3);
    expect(decodeURIComponent(p1.serialize())).toBe(
      'foo=bar&baz[]=qux&baz[]=foo&qux={"bar":"foo"}'
    );
  });
});
