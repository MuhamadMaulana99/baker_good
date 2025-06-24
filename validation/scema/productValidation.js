const Joi = require('joi');

const createProductSchema = Joi.object({
    product_name: Joi.string().min(2).required().messages({
        'string.empty': 'Nama produk tidak boleh kosong.',
        'string.min': 'Nama produk minimal 2 karakter.',
        'any.required': 'Nama produk diperlukan.'
    })
});

const updateProductSchema = Joi.object({
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
