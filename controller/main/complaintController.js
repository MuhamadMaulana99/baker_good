const asyncHandler = require('express-async-handler');
const { Complaint, User, Product, Category } = require('../../model');

module.exports = {
    addComplaint: asyncHandler(async (req, res) => {
        const {
            user_id, product_id, category_id,
            customer_name, contact, description,
            image, date_occurrence
        } = req.body;

        const newComplaint = await Complaint.create({
            user_id,
            product_id,
            category_id,
            customer_name,
            contact,
            description,
            image,
            date_occurrence,
            status: 'Masuk',
        });

        res.status(201).json(newComplaint);
    }),

    getComplaints: asyncHandler(async (req, res) => {
        const complaints = await Complaint.findAll({
            include: [
                { model: User, as: 'user', attributes: ['id_users', 'username', 'userRoles'] },
                { model: Product, as: 'product', attributes: ['id', 'product_name'] },
                { model: Category, as: 'category', attributes: ['id', 'category_name'] },
            ]
        });

        res.json(complaints);
    }),

    updateComplaintStatus: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { status, admin_response } = req.body;

        const [updated] = await Complaint.update(
            { status, admin_response },
            { where: { id } }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Data pengaduan tidak ditemukan.' });
        }

        const updatedData = await Complaint.findByPk(id);
        res.json(updatedData);
    }),

    deleteComplaint: asyncHandler(async (req, res) => {
        const { id } = req.params;

        const deleted = await Complaint.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: 'Data pengaduan tidak ditemukan.' });
        }

        res.json({ message: 'Data pengaduan berhasil dihapus.' });
    }),
};
