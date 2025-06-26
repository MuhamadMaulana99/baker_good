const asyncHandler = require('express-async-handler');
const { Product, Category } = require('../../model');

module.exports = {
    addProduct: asyncHandler(async (req, res) => {
        const { product_name, category_id } = req.body;

        // Validasi opsional
        if (!product_name || !category_id) {
            return res.status(400).json({ message: "Nama produk dan kategori wajib diisi." });
        }

        const product = await Product.create({ product_name, category_id });

        res.status(201).json(product);
    }),

    updateProduct: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { product_name } = req.body;

        const [updated] = await Product.update({ product_name }, { where: { id } });

        if (!updated) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }

        const product = await Product.findByPk(id);
        res.json(product);
    }),
    getProducts: asyncHandler(async (req, res) => {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'category_name'], // pilih kolom yang diambil
                }
            ]
        });
        res.json(products);
    }),

    deleteProduct: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const deleted = await Product.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }

        res.json({ message: 'Produk berhasil dihapus.' });
    }),
};
