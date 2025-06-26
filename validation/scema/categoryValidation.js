const Joi = require('joi');
const { kategoriPengaduan } = require('../../helper');

const createCategorySchema = Joi.object({

    category_name: Joi.string().required().messages({
        'any.required': 'Nama Category wajib diisi.',
    }),
});

const updateCategorySchema = Joi.object({
    category_name: Joi.string().required().messages({
        'any.required': 'Nama Category wajib diisi.',
    }),
});


module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
