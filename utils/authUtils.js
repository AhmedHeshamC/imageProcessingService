module.exports = {
  hashPassword: async (password) => {
    // Stub: returns the password reversed
    return password.split('').reverse().join('');
  },
  verifyPassword: async (password, hash) => {
    // Stub: checks if reversed password matches hash
    return password.split('').reverse().join('') === hash;
  }
};
