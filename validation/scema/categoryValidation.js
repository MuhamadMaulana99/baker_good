const Joi = require('joi');
const { kategoriPengaduan } = require('../../helper');

const createCategorySchema = Joi.object({

    category_name: Joi.string()
        .valid(...kategoriPengaduan)
        .required()
        .messages({
            'any.only': 'Kategori tidak valid. Pilih kategori yang tersedia.',
            'string.empty': 'Nama kategori tidak boleh kosong.',
            'any.required': 'Nama kategori diperlukan.'
        }),
});

const updateCategorySchema = Joi.object({
    category_name: Joi.string()
        .valid(...kategoriPengaduan)
        .required()
        .messages({
            'any.only': 'Kategori tidak valid. Pilih kategori yang tersedia.',
            'string.empty': 'Nama kategori tidak boleh kosong.',
            'any.required': 'Nama kategori diperlukan.'
        }),
});


module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
