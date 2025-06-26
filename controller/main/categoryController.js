const asyncHandler = require('express-async-handler');
const { Category, Complaint } = require('../../model');
const { fn, Op, col } = require('sequelize');

module.exports = {
  addCategory: asyncHandler(async (req, res) => {
    const { category_name } = req.body;

    // Cek apakah kategori sudah ada
    const existingCategory = await Category.findOne({ where: { category_name } });

    if (existingCategory) {
      return res.status(400).json({ message: 'Kategori sudah ada.' });
    }

    // Jika belum ada, buat kategori baru
    const category = await Category.create({ category_name });
    res.status(201).json(category);
  }),


  getCategories: asyncHandler(async (req, res) => {
    const search = req.query.search || ""; // ambil query dari URL, default ""

    const categories = await Category.findAll({
      where: search
        ? {
          category_name: {
            [Op.like]: `%${search}%`,
          },
        }
        : undefined, // jika search kosong, jangan set where
      include: [
        {
          model: Complaint,
          as: 'complaints',
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [fn('COUNT', col('complaints.id')), 'total_complaints']
        ],
      },
      group: ['Category.id'],
    });

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
