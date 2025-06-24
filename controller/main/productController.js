const asyncHandler = require('express-async-handler');
const { Product } = require('../../model');

module.exports = {
    addProduct: asyncHandler(async (req, res) => {
        const { product_name } = req.body;
        const product = await Product.create({ product_name });
        res.status(201).json(product);
    }),

    getProducts: asyncHandler(async (req, res) => {
        const products = await Product.findAll();
        res.json(products);
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

    deleteProduct: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const deleted = await Product.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }

        res.json({ message: 'Produk berhasil dihapus.' });
    }),
};
