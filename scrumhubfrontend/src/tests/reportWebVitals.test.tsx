/**
 * @jest-environment jsdom
 */
import reportWebVitals from "../reportWebVitals";
jest.mock('web-vitals');

const originalConsoleError = console.error;

describe('Report', () => {
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {console.error = originalConsoleError;});
   const thresholds = {LCP: {},FID: { }, CLS: {},FCP: { }, TTFB: {},};
  it('includes the expected metrics in the thresholds', () => {
    expect(Object.keys(thresholds)).toEqual([
      'LCP',
      'FID',
      'CLS',
      'FCP',
      'TTFB',
    ]);
  });
  it('console log metrics', () => {
    expect(reportWebVitals(console.log)).toBe(undefined);
  });
});