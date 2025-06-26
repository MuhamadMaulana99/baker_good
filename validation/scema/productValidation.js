const Joi = require('joi');

const createProductSchema = Joi.object({
    category_id: Joi.number().required().messages({
        'any.required': 'Category harus dipilih.',
    }),
    product_name: Joi.string().min(2).required().messages({
        'string.empty': 'Nama produk tidak boleh kosong.',
        'string.min': 'Nama produk minimal 2 karakter.',
        'any.required': 'Nama produk diperlukan.'
    })
});

const updateProductSchema = Joi.object({
    category_id: Joi.number().required().messages({
        'any.required': 'Category harus dipilih.',
    }),
    product_name: Joi.string().min(2).required().messages({
        'string.empty': 'Nama produk tidak boleh kosong.',
        'string.min': 'Nama produk minimal 2 karakter.',
        'any.required': 'Nama produk diperlukan.'
    })
});

module.exports = {
    createProductSchema,
    updateProductSchema,
};
