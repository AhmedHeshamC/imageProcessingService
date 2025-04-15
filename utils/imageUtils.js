module.exports = {
  resize: async (buffer, width, height) => {
    if (!buffer) {
      throw new Error('Invalid input');
    }
    return buffer;
  }
};
