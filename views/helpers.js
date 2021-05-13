module.exports = {
  getError(errors, prop) {
    try {
      // See lecture 394 for explanation
      // mapped() is a part of express-validator
      return errors.mapped()[prop].msg;
    } catch (err) {
      return "";
    }
  },
};
