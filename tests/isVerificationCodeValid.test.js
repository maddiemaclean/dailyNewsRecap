
const { isVerificationCodeValid } = require('../src/users/utils');

describe('isVerificationCodeValid', () => {
  test('returns true when times are less than 1 hour apart', () => {
    const now = new Date();
    const MinAgo30 = new Date(now.getTime() - 30 * 60 * 1000); 

    const result = isVerificationCodeValid(now.toISOString(), MinAgo30.toISOString());
    expect(result).toBe(true);
  });

  test('returns false when times are more than 1 hour apart', () => {
    const now = new Date();
    const HoursAgo2 = new Date(now.getTime() - 2 * 60 * 60 * 1000); 

    const result = isVerificationCodeValid(now.toISOString(), HoursAgo2.toISOString());
    expect(result).toBe(false);
  });

  test('returns true when times are exactly 1 hour apart', () => {
    const now = new Date();
    const HourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const result = isVerificationCodeValid(now.toISOString(), HourAgo.toISOString());
    expect(result).toBe(true);
  });

  test('handles swapped time order correctly', () => {
    const now = new Date();
    const MinsAhead45 = new Date(now.getTime() + 45 * 60 * 1000); 

    const result = isVerificationCodeValid(now.toISOString(), MinsAhead45.toISOString());
    expect(result).toBe(true);
  });
});
