const imageUtils = require('../utils/imageUtils');
const authUtils = require('../utils/authUtils');

describe('Image Utilities', () => {
  it('should resize image correctly', async () => {
    // ...existing code to mock image buffer...
    // const resized = await imageUtils.resize(buffer, 100, 100);
    // expect(resized).toBeInstanceOf(Buffer);
  });

  it('should throw error for invalid input', async () => {
    await expect(imageUtils.resize(null, 100, 100)).rejects.toThrow();
  });

  // ...more tests...
});

describe('Auth Utilities', () => {
  it('should hash and verify password', async () => {
    const password = 'secret';
    const hash = await authUtils.hashPassword(password);
    const valid = await authUtils.verifyPassword(password, hash);
    expect(valid).toBe(true);
  });

  it('should fail verification with wrong password', async () => {
    const hash = await authUtils.hashPassword('secret');
    const valid = await authUtils.verifyPassword('wrong', hash);
    expect(valid).toBe(false);
  });

  // ...more tests...
});
