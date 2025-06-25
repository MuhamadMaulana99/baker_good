module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      const messages = error.details.map(detail => detail.message);
      return res.status(400).json({ message: "Validasi gagal", errors: messages });
    }
    next();
  };
};
