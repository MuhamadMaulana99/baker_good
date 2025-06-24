const Joi = require('joi');

const createComplaintSchema = Joi.object({
    user_id: Joi.number().optional(), // optional karena bisa ambil dari token
    product_id: Joi.number().required().messages({
        'any.required': 'Produk harus dipilih.',
    }),
    category_id: Joi.number().required().messages({
        'any.required': 'Kategori harus dipilih.',
    }),
    customer_name: Joi.string().required().messages({
        'any.required': 'Nama pelanggan wajib diisi.',
    }),
    contact: Joi.string().required().messages({
        'any.required': 'Kontak wajib diisi.',
    }),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    date_occurrence: Joi.date().optional(),
});

const updateComplaintStatusSchema = Joi.object({
    status: Joi.string().required(),
    admin_response: Joi.string().allow('', null),
});

module.exports = {
    createComplaintSchema,
    updateComplaintStatusSchema,
};
