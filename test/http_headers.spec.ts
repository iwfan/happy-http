import { HttpHeaders } from '../lib/core/http_headers';

describe('As HttpHeaders', () => {
  it('should construction correct', () => {
    const headers = new HttpHeaders();
    expect(headers).toBeTruthy();
    expect(headers instanceof HttpHeaders);
  });

  it('should return true when call has function with exists header key', () => {
    const headers = new HttpHeaders();
    headers.set('Content-Encoding', 'gzip');
    expect(headers.has('Content-Encoding')).toBe(true);
  });

  it('should ignore case of header key', () => {
    const headers = new HttpHeaders();
    headers.set('Content-Encoding', 'gzip').set('Accept-Charset', 'utf-8');
    expect(headers.has('content-encoding')).toBe(true);
    expect(headers.has('Accept-charset')).toBe(true);
  });

  it('should delete successful', () => {
    const headers = new HttpHeaders();
    headers.set('Content-Encoding', 'gzip').delete('content-encoding');

    expect(headers.get('content-encoding')).toBe(undefined);
  });

  it('should return entries', () => {
    const headers = new HttpHeaders();
    headers
      .set('Content-Encoding', 'gzip')
      .set('Accept-Charset', ['utf-8', 'gbk']);

    expect(headers.getAll()).toEqual({
      'content-encoding': 'gzip',
      'accept-charset': 'utf-8,gbk'
    });
  });

  it('should construction correct with HttpHeadersInit', () => {
    const headers = new HttpHeaders({
      Connection: 'keep-alive',
      Accept: ['application/json', 'text/plain']
    });
    expect(headers.get('Accept')).toEqual(['application/json', 'text/plain']);
  });

  it('should construction correct with HttpHeaders', () => {
    const headers = new HttpHeaders();
    const hs = new HttpHeaders(headers);
    expect(hs).toBe(headers);
  });
});
