const { Op, fn, col, literal } = require("sequelize");
const moment = require("moment");
const asyncHandler = require('express-async-handler');
const { Complaint, User, Product, Category, sequelize } = require('../../model');
const { kodeKategoriMap, allowedStatus } = require('../../helper');
const { default: axios } = require("axios");

module.exports = {
    // ✅ Tambah Pengaduan
    addComplaint: asyncHandler(async (req, res) => {
        try {
            const {
                user_id, product_id, category_id,
                customer_name, contact, description,
                image, date_occurrence, email
            } = req.body;

            // Validasi kategori
            if (!category_id) {
                return res.status(400).json({ message: "Kategori wajib diisi." });
            }

            const category = await Category.findByPk(category_id);
            if (!category) {
                return res.status(404).json({ message: "Kategori tidak ditemukan." });
            }

            // Generate kode pengaduan
            const prefix = kodeKategoriMap[category.category_name] || "UNK";
            const count = await Complaint.count({ where: { category_id } });
            const code_complaint = `${prefix}-${String(count + 1).padStart(5, '0')}`;

            // Buat pengaduan baru
            const newComplaint = await Complaint.create({
                code_complaint,
                product_id,
                category_id,
                customer_name,
                contact,
                description,
                image,
                email,
                date_occurrence,
                status: 'Masuk',
            });

            // Kirim notifikasi WhatsApp via Fonnte API
            const fonnteApiKey = "oLoXideJNx2LyDNmrfhQ"; // Ganti dengan API Key Fonnte Anda
            const whatsappMessage = `
📢 *PENGADUAN BARU DITERIMA*  
            
*No. Pengaduan*: ${code_complaint}  
*Nama Pelanggan*: ${customer_name}  
*Kategori*: ${category.category_name}  
*Deskripsi*: ${description}  
            
Segera tanggapi di sistem!  
        `;

            await axios.post('https://api.fonnte.com/send', {
                target: contact, // Nomor dari req.body.contact (format: 081234567890)
                message: whatsappMessage,
            }, {
                headers: {
                    'Authorization': fonnteApiKey
                }
            });

            res.status(201).json({
                complaint: newComplaint,
                message: "Pengaduan berhasil dibuat dan notifikasi terkirim."
            });

        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({
                message: "Gagal menambahkan pengaduan",
                details: error.message
            });
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
                return res.status(200).json({
                    message: "Pengaduan tidak ditemukan.",
                    data: [],
                });
            }

            res.status(200).json({
                message: "Pengaduan ditemukan.",
                data: complaints,
            });
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


    getComplaintOverview: asyncHandler(async (req, res) => {
        try {
            // === 1. Status Summary ===
            const statuses = ['Masuk', 'Diproses', 'Selesai', 'Ditolak'];
            const statusSummary = {};
            for (const status of statuses) {
                statusSummary[status] = await Complaint.count({ where: { status } });
            }

            // === 2. Generate 6 Bulan Terakhir ===
            const now = moment();
            const sixMonths = [];
            for (let i = 5; i >= 0; i--) {
                const date = now.clone().subtract(i, 'months');
                sixMonths.push({
                    key: date.format('YYYY-MM'),
                    label: date.format('MMMM YYYY'),
                    total: 0
                });
            }

            // === 3. Ambil Data Dari DB ===
            const monthlyData = await Complaint.findAll({
                attributes: [
                    [literal("DATE_FORMAT(createdAt, '%Y-%m')"), 'month'],
                    [fn('COUNT', col('id')), 'total']
                ],
                where: {
                    createdAt: {
                        [Op.between]: [moment().subtract(5, 'months').startOf('month').toDate(), moment().endOf('month').toDate()]
                    }
                },
                group: [literal("DATE_FORMAT(createdAt, '%Y-%m')")],
                order: [literal("DATE_FORMAT(createdAt, '%Y-%m') ASC")],
                raw: true
            });

            // === 4. Mapping ke Bulan Lengkap ===
            const monthly_summary = sixMonths.map(month => {
                const found = monthlyData.find(m => m.month === month.key);
                return {
                    month: month.label,
                    total: found ? parseInt(found.total) : 0
                };
            });

            // === 5. Distribusi berdasarkan kategori ===
            const categoryData = await Complaint.findAll({
                attributes: [
                    [literal('`category`.`category_name`'), 'category'],
                    [fn('COUNT', col('Complaint.id')), 'total']
                ],
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: []
                    }
                ],
                group: ['`category`.`category_name`'],
                raw: true
            });

            res.status(200).json({
                message: "Rekap pengaduan berhasil",
                data: {
                    status_summary: statusSummary,
                    monthly_summary,
                    category_distribution: categoryData
                }
            });

        } catch (error) {
            res.status(500).json({
                message: "Gagal mengambil data rekap pengaduan",
                details: error.message
            });
        }
    }),

    getTodayComplaints: asyncHandler(async (req, res) => {
        try {
            const startOfToday = moment().startOf('day').toDate();
            const endOfToday = moment().endOf('day').toDate();

            const complaints = await Complaint.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startOfToday, endOfToday]
                    }
                },
                include: [
                    { model: User, as: 'user', attributes: ['id_users', 'username', 'userRoles'] },
                    { model: Product, as: 'product', attributes: ['id', 'product_name'] },
                    { model: Category, as: 'category', attributes: ['id', 'category_name'] },
                ],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json({
                message: "Data pengaduan terbaru hari ini berhasil diambil",
                data: complaints
            });

        } catch (error) {
            res.status(500).json({
                message: "Gagal mengambil data pengaduan hari ini",
                details: error.message
            });
        }
    }),

    getComplaintReport: asyncHandler(async (req, res) => {
        try {
            const { status, category, from, to } = req.query;

            // === 🔎 Filter Dinamis ===
            const filters = {};
            if (status) filters.status = status;
            if (from && to) {
                filters.createdAt = {
                    [Op.between]: [
                        moment(from, 'YYYY-MM-DD').startOf('day').toDate(),
                        moment(to, 'YYYY-MM-DD').endOf('day').toDate()
                    ]
                };
            }

            // === 🗂️ Join Category & Product untuk filter kategori ===
            const includeOptions = [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_name'],
                    ...(category ? { where: { category_name: category } } : {})
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['product_name']
                }
            ];

            // === Ambil Semua Data Complaint yang Sesuai Filter ===
            const complaints = await Complaint.findAll({
                where: filters,
                include: includeOptions,
                raw: true
            });

            const total = complaints.length;
            const resolved = complaints.filter(c => c.status === 'Selesai').length;
            const pending = complaints.filter(c => c.status === 'Masuk').length;
            const inProgress = complaints.filter(c => c.status === 'Diproses').length;
            const rejected = complaints.filter(c => c.status === 'Ditolak').length;

            // === Estimasi Waktu Penyelesaian (mocked) ===
            const avgResolutionTime = (Math.random() * 5 + 1).toFixed(1); // random 1–6 hari
            const customerSatisfaction = (Math.random() * 2 + 3).toFixed(1); // random 3–5

            // === Group by Status ===
            const statusCounts = {};
            complaints.forEach(c => {
                const key = c.status || 'Tidak diketahui';
                statusCounts[key] = (statusCounts[key] || 0) + 1;
            });

            const byStatus = Object.entries(statusCounts).map(([status, count]) => ({
                status,
                count,
                percentage: total === 0 ? 0 : Math.round((count / total) * 100)
            }));

            // === Group by Category ===
            const catCounts = {};
            complaints.forEach(c => {
                const key = c['category.category_name'] || 'Lainnya';
                catCounts[key] = (catCounts[key] || 0) + 1;
            });

            const byCategory = Object.entries(catCounts).map(([category, count]) => ({
                category,
                count,
                percentage: total === 0 ? 0 : Math.round((count / total) * 100)
            }));

            // === Group by Product ===
            const productCounts = {};
            complaints.forEach(c => {
                const key = c['product.product_name'] || 'Lainnya';
                productCounts[key] = (productCounts[key] || 0) + 1;
            });

            const byProduct = Object.entries(productCounts).map(([product, count]) => ({
                product,
                count,
                percentage: total === 0 ? 0 : Math.round((count / total) * 100)
            }));

            // === Monthly Data (6 Bulan) ===
            const now = moment();
            const sixMonths = [];
            for (let i = 5; i >= 0; i--) {
                const m = now.clone().subtract(i, 'months');
                const key = m.format('YYYY-MM');
                sixMonths.push({
                    key,
                    label: m.format('MMM'),
                    complaints: 0,
                    resolved: 0
                });
            }

            complaints.forEach(c => {
                const createdKey = moment(c.createdAt).format('YYYY-MM');
                const bulan = sixMonths.find(b => b.key === createdKey);
                if (bulan) {
                    bulan.complaints++;
                    if (c.status === 'Selesai') bulan.resolved++;
                }
            });

            const monthly = sixMonths.map(({ label, complaints, resolved }) => ({
                month: label,
                complaints,
                resolved
            }));

            // === Response JSON ===
            const reportData = {
                summary: {
                    totalComplaints: total,
                    resolvedComplaints: resolved,
                    pendingComplaints: pending,
                    inProgressComplaints: inProgress,
                    rejectedComplaints: rejected,
                    avgResolutionTime: parseFloat(avgResolutionTime),
                    customerSatisfaction: parseFloat(customerSatisfaction),
                },
                byStatus,
                byCategory,
                byProduct,
                monthly
            };

            res.status(200).json({
                message: "Laporan pengaduan berhasil diambil",
                data: reportData
            });

        } catch (error) {
            res.status(500).json({
                message: "Gagal mengambil laporan",
                details: error.message
            });
        }
    }),


};
