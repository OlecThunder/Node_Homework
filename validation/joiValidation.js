const Joi = require("joi");

module.exports = {
  validateTask: schema => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json({
          message: `${result.error}`
        });
      }
      next();
    };
  },

  schemas: {
    addTaskSchema: Joi.object().keys({
      task: Joi.string().required(),
      finishTime: Joi.string(),
      owner: Joi.string(),
      done: Joi.boolean()
    }),
    changeTaskScheme: Joi.object().keys({
      task: Joi.string(),
      finishTime: Joi.string(),
      owner: Joi.string(),
      done: Joi.boolean()
    })
  }
};
