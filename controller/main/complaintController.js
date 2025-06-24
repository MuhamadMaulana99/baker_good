const { Complaint, User, Product, Category } = require('../../model/index.js');

module.exports = {
    addComplaint: async (req, res) => {
        try {
            const {
                user_id, product_id, category_id,
                customer_name, contact, description,
                image, date_occurrence
            } = req.body;

            // Validasi
            if (!customer_name || !contact || !product_id || !category_id) {
                return res.status(400).json({ error: "Field wajib belum diisi." });
            }

            const newComplaint = await Complaint.create({
                user_id, product_id, category_id,
                customer_name, contact, description,
                image, date_occurrence,
                status: "Masuk"
            });

            res.json(newComplaint);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getComplaints: async (req, res) => {
        try {
            const complaints = await Complaint.findAll({
                include: [
                    { model: User, as: 'user', attributes: ['id_users', 'username', 'userRoles'] },
                    { model: Product, as: 'product', attributes: ['id', 'product_name'] },
                    { model: Category, as: 'category', attributes: ['id', 'category_name'] },
                ]
            });

            res.json(complaints);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateComplaintStatus: async (req, res) => {
        try {
            const { id } = req.params;
            const { status, admin_response } = req.body;

            const [updated] = await Complaint.update({ status, admin_response }, {
                where: { id }
            });

            if (updated) {
                const updatedData = await Complaint.findByPk(id);
                res.json(updatedData);
            } else {
                res.status(404).json({ message: "Data pengaduan tidak ditemukan." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteComplaint: async (req, res) => {
        try {
            const { id } = req.params;
            const deleted = await Complaint.destroy({ where: { id } });
            if (deleted) {
                res.json({ message: "Data pengaduan berhasil dihapus." });
            } else {
                res.status(404).json({ message: "Data pengaduan tidak ditemukan." });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
