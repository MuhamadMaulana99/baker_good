const asyncHandler = require('express-async-handler');
const { Complaint, User, Product, Category } = require('../../model');
const { kodeKategoriMap, allowedStatus } = require('../../helper');

module.exports = {
    // ✅ Tambah Pengaduan
    addComplaint: asyncHandler(async (req, res) => {
        try {
            const {
                user_id, product_id, category_id,
                customer_name, contact, description,
                image, date_occurrence
            } = req.body;

            if (!category_id) {
                return res.status(400).json({ message: "Kategori wajib diisi." });
            }

            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(404).json({ message: "Kategori tidak ditemukan." });
            }

            const prefix = kodeKategoriMap[category.category_name] || "UNK";
            const count = await Complaint.count({ where: { category_id } });
            const code_complaint = `${prefix}-${String(count + 1).padStart(5, '0')}`;

            const newComplaint = await Complaint.create({
                code_complaint,
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
        } catch (error) {
            res.status(500).json({ message: "Gagal menambahkan pengaduan", details: error.message });
        }
    }),

    // ✅ Ambil Semua Pengaduan
    getComplaints: asyncHandler(async (req, res) => {
        try {
            const complaints = await Complaint.findAll({
                include: [
                    { model: User, as: 'user', attributes: ['id_users', 'username', 'userRoles'] },
                    { model: Product, as: 'product', attributes: ['id', 'product_name'] },
                    { model: Category, as: 'category', attributes: ['id', 'category_name'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json(complaints);
        } catch (error) {
            res.status(500).json({ message: "Gagal mengambil data pengaduan", details: error.message });
        }
    }),

    // ✅ Update Status
    updateComplaintStatus: asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const { status, admin_response } = req.body;

            if (!status) {
                return res.status(400).json({ message: "Status tidak boleh kosong." });
            }

            const [updated] = await Complaint.update(
                { status, admin_response },
                { where: { id } }
            );

            if (!updated) {
                return res.status(404).json({ message: 'Data pengaduan tidak ditemukan.' });
            }

            const updatedData = await Complaint.findByPk(id);
            res.status(200).json(updatedData);
        } catch (error) {
            res.status(500).json({ message: "Gagal memperbarui status pengaduan", details: error.message });
        }
    }),

    // ✅ Hapus Pengaduan
    deleteComplaint: asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;

            const deleted = await Complaint.destroy({ where: { id } });

            if (!deleted) {
                return res.status(404).json({ message: 'Data pengaduan tidak ditemukan.' });
            }

            res.status(200).json({ message: 'Data pengaduan berhasil dihapus.' });
        } catch (error) {
            res.status(500).json({ message: "Gagal menghapus pengaduan", details: error.message });
        }
    }),

    // ✅ Search by code
    searchComplaintByCode: asyncHandler(async (req, res) => {
        try {
            const { code } = req.params;

            if (!code) {
                return res.status(400).json({ message: "Kode pengaduan wajib diisi." });
            }

            const complaints = await Complaint.findAll({
                where: { code_complaint: code },
                include: [
                    { model: User, as: 'user', attributes: ['id_users', 'username', 'userRoles'] },
                    { model: Product, as: 'product', attributes: ['id', 'product_name'] },
                    { model: Category, as: 'category', attributes: ['id', 'category_name'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            if (!complaints.length) {
                return res.status(404).json({ message: "Pengaduan tidak ditemukan." });
            }

            res.status(200).json(complaints);
        } catch (error) {
            res.status(500).json({ message: "Gagal mencari pengaduan", details: error.message });
        }
    }),


    // ✅ Filter by status
    filterComplaintByStatus: asyncHandler(async (req, res) => {
        try {
            const { status } = req.params;

            if (!status) {
                return res.status(400).json({ message: "Status wajib diisi." });
            }
            // ✅ Validasi apakah status termasuk yang diperbolehkan
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Status tidak valid." });
            }

            const complaints = await Complaint.findAll({
                where: { status },
                include: [
                    { model: User, as: 'user', attributes: ['id_users', 'username', 'userRoles'] },
                    { model: Product, as: 'product', attributes: ['id', 'product_name'] },
                    { model: Category, as: 'category', attributes: ['id', 'category_name'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json(complaints);
        } catch (error) {
            res.status(500).json({ message: "Gagal memfilter pengaduan", details: error.message });
        }
    }),
    filterComplaintByStatusAndCategory: asyncHandler(async (req, res) => {
        try {
            const { status, category_id } = req.params;

            // 🔒 Validasi input
            if (!status || !category_id) {
                return res.status(400).json({ message: "Status dan category_id wajib diisi." });
            }

            if (!allowedStatus.includes(status)) {
                return res.status(400).json({ message: "Status tidak valid." });
            }

            const complaints = await Complaint.findAll({
                where: { status, category_id },
                include: [
                    { model: User, as: 'user', attributes: ['id_users', 'username', 'userRoles'] },
                    { model: Product, as: 'product', attributes: ['id', 'product_name'] },
                    { model: Category, as: 'category', attributes: ['id', 'category_name'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            res.status(200).json(complaints);
        } catch (error) {
            res.status(500).json({ message: "Gagal memfilter pengaduan", details: error.message });
        }
    }),

    getComplaintStatusSummary: asyncHandler(async (req, res) => {
        try {
            const result = {};

            for (const status of allowedStatus) {
                const count = await Complaint.count({ where: { status } });
                result[status] = count;
            }

            res.status(200).json({
                message: "Rekap jumlah pengaduan berdasarkan status",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                message: "Gagal mengambil data rekap pengaduan",
                details: error.message,
            });
        }
    }),


};
