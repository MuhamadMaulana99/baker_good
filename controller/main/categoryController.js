const { Category  } = require('../../model/index.js');

module.exports = {
  addCategory: async (req, res) => {
    try {
      const { category_name } = req.body;
      if (!category_name) {
        return res.status(400).json({ error: "Nama kategori diperlukan." });
      }

      const category = await Category.create({ category_name });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { category_name } = req.body;
      const [updated] = await Category.update({ category_name }, { where: { id } });
      if (updated) {
        const category = await Category.findByPk(id);
        res.json(category);
      } else {
        res.status(404).json({ message: "Kategori tidak ditemukan." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Category.destroy({ where: { id } });
      if (deleted) {
        res.json({ message: "Kategori berhasil dihapus." });
      } else {
        res.status(404).json({ message: "Kategori tidak ditemukan." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
