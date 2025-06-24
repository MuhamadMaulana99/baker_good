const { Product } = require('../../model/index.js');

module.exports = {
    addProduct: async (req, res) => {
        try {
            const { product_name } = req.body;
            if (!product_name) {
                return res.status(400).json({ error: "Nama produk diperlukan." });
            }

            const product = await Product.create({ product_name });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getProducts: async (req, res) => {
        try {
            const products = await Product.findAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const { product_name } = req.body;
            const [updated] = await Product.update({ product_name }, { where: { id } });
            if (updated) {
                const product = await Product.findByPk(id);
                res.json(product);
            } else {
                res.status(404).json({ message: "Produk tidak ditemukan." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Product.destroy({ where: { id } });
            if (deleted) {
                res.json({ message: "Produk berhasil dihapus." });
            } else {
                res.status(404).json({ message: "Produk tidak ditemukan." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
