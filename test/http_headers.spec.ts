import { HttpHeaders } from '../lib/core/http_headers';

describe('As HttpHeaders', () => {
  it('should construction correct', () => {
    const headers = new HttpHeaders();
    expect(headers).toBeTruthy();
    expect(headers instanceof HttpHeaders);
  });

  it('should have a default accept header', () => {
    const h = new HttpHeaders();
    expect(h.get('Accept')).toEqual(['application/json', 'text/plain', '*/*']);
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
      'accept-charset': 'utf-8,gbk',
      accept: 'application/json,text/plain,*/*'
    });
  });

  it('should construction correct with HttpHeadersInit', () => {
    const headers = new HttpHeaders({
      Connection: 'keep-alive',
      Accept: ['application/json', 'text/plain']
    });
    expect(headers.get('Accept')).toEqual(['application/json', 'text/plain']);
  });

  it('should have all header when call merge', () => {
    const headers = new HttpHeaders();
    headers.set('Content-Encoding', 'gzip');

    const hs = new HttpHeaders();
    hs.set('Accept-Charset', ['utf-8', 'gbk']);
    headers.merge(hs);
    headers.merge({
      Connection: 'keep-alive'
    });
    expect(headers.getAll()).toEqual({
      'content-encoding': 'gzip',
      'accept-charset': 'utf-8,gbk',
      connection: 'keep-alive',
      accept: 'application/json,text/plain,*/*'
    });
  });
});
