const asyncHandler = require('express-async-handler');
const { Category } = require('../../model');

module.exports = {
  addCategory: asyncHandler(async (req, res) => {
    const { category_name } = req.body;
    const category = await Category.create({ category_name });
    res.status(201).json(category);
  }),

  getCategories: asyncHandler(async (req, res) => {
    const categories = await Category.findAll();
    res.json(categories);
  }),

  updateCategory: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { category_name } = req.body;

    const [updated] = await Category.update({ category_name }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    const category = await Category.findByPk(id);
    res.json(category);
  }),

  deleteCategory: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deleted = await Category.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    res.json({ message: 'Kategori berhasil dihapus.' });
  }),
};
