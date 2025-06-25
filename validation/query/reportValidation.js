const Joi = require('joi');
const { kategoriPengaduan, allowedStatus } = require('../../helper');

// const allowedStatus = ['Masuk', 'Diproses', 'Selesai', 'Ditolak'];

const reportQuerySchema = Joi.object({
    status: Joi.string().valid(...allowedStatus).optional(),
    category: Joi.string().valid(...kategoriPengaduan).optional(),
    from: Joi.date().iso().messages({
        'date.format': 'Format tanggal harus YYYY-MM-DD'
    }).optional(),
    to: Joi.date().iso().messages({
        'date.format': 'Format tanggal harus YYYY-MM-DD'
    }).optional()
});

module.exports = { reportQuerySchema };
