const Joi = require('joi');

const createComplaintSchema = Joi.object({
    user_id: Joi.number().allow(null).optional(),

    product_id: Joi.number().required().messages({
        'any.required': 'Produk harus dipilih.',
    }),
    category_id: Joi.number().required().messages({
        'any.required': 'Kategori harus dipilih.',
    }),
    customer_name: Joi.string().required().messages({
        'any.required': 'Nama pelanggan wajib diisi.',
    }),
    email: Joi.string().required().messages({
        'any.required': 'Email pelanggan wajib diisi.',
    }),
    contact: Joi.string().required().messages({
        'any.required': 'Kontak wajib diisi.',
    }),
    status: Joi.string()
        .valid('Masuk', 'Diproses', 'Selesai', 'Ditolak')
        .required(),
    description: Joi.string().optional(),
    image: Joi.string().allow(null).optional(), 
    date_occurrence: Joi.date().optional(),
});

const updateComplaintStatusSchema = Joi.object({
    user_id: Joi.number().optional(),
    status: Joi.string()
        .valid('Masuk', 'Diproses', 'Selesai', 'Ditolak')
        .required(),
    admin_response: Joi.string()
        .required()
        .min(1)
        .messages({
            'string.empty': 'Respon admin tidak boleh kosong.',
            'any.required': 'Respon admin wajib diisi.'
        }),
});


module.exports = {
    createComplaintSchema,
    updateComplaintStatusSchema,
};
