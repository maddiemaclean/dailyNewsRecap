// utils.test.js
const { generateValidationCode } = require('../src/users/utils');

describe('generateValidationCode', () => {
    test('should return a string of length 6', () => {
        const code = generateValidationCode();
        expect(code).toHaveLength(6);
    });

    test('should return lowercase alphanumeric characters only', () => {
        const code = generateValidationCode();
        expect(code).toMatch(/^[a-z0-9]{6}$/);
    });
});
