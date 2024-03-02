const Joi = require('joi');

const TShirtValidation = Joi.object({
name:Joi.string().required(),
description: Joi.string(),
price: Joi.number().required(),
available_quantity:Joi.number().required(),
image_url:Joi.string(),
});

const fetcTshirthById = Joi.object({
    tshirt_id:Joi.number().required()
})


function schemaValidation(req,validationModel){
    const error = this[validationModel].validate(req.body);
    if (error.error) {
      // Handle validation error
      const { details } = error.error;
      const message = details.map(err => err.message).join(', ');
    //   res.status(400).json({ error: message });
      return message;
    }
}

module.exports = {schemaValidation, TShirtValidation, fetcTshirthById};