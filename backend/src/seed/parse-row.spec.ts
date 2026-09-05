import { parseRow } from './parse-row';

// Real lines taken from the dataset.
const FULL = '01000001,8.4,6.75,8.0,6.0,5.25,5.0,,,,N1';
const SOCIAL = '01000007,6.0,7.5,,,,,6.75,7.0,7.0,';

describe('parseRow', () => {
  it('maps every column of a natural sciences row', () => {
    expect(parseRow(FULL.split(','))).toEqual({
      sbd: '01000001',
      toan: '8.4',
      nguVan: '6.75',
      ngoaiNgu: '8.0',
      vatLi: '6.0',
      hoaHoc: '5.25',
      sinhHoc: '5.0',
      lichSu: null,
      diaLi: null,
      gdcd: null,
      maNgoaiNgu: 'N1',
    });
  });

  it('turns an empty cell into null, never into zero', () => {
    const row = parseRow(SOCIAL.split(','));
    expect(row.ngoaiNgu).toBeNull();
    expect(row.vatLi).toBeNull();
    expect(row.maNgoaiNgu).toBeNull();
  });

  it('keeps the leading zero of the registration number', () => {
    expect(parseRow(FULL.split(',')).sbd).toBe('01000001');
  });

  it('rejects a row that does not have 11 columns', () => {
    expect(() => parseRow(['01000001', '8.0'])).toThrow(/11 columns/);
  });
});
