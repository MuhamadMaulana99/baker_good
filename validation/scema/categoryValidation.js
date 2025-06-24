const Joi = require('joi');

const createCategorySchema = Joi.object({
    category_name: Joi.string().min(3).required().messages({
        'string.empty': 'Nama kategori tidak boleh kosong.',
        'string.min': 'Nama kategori minimal 3 karakter.',
        'any.required': 'Nama kategori diperlukan.'
    }),
});

const updateCategorySchema = Joi.object({
    category_name: Joi.string().min(3).required().messages({
        'string.empty': 'Nama kategori tidak boleh kosong.',
        'string.min': 'Nama kategori minimal 3 karakter.',
        'any.required': 'Nama kategori diperlukan.'
    }),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
