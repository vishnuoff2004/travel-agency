const authService = require('../services/authService');
const { validateRegister, validateLogin } = require('../validations/authValidation');

async function register(req, res, next) {
  try {
    const validation = validateRegister(req.body);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
        errors: validation.error.details.map(d => d.message),
      });
    }
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ message: err.message });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const validation = validateLogin(req.body);
    if (validation.error) {
      return res.status(400).json({
        message: validation.error.details[0].message,
        errors: validation.error.details.map(d => d.message),
      });
    }
    const result = await authService.login(req.body.email, req.body.password);
    res.status(200).json(result);
  } catch (err) {
    if (err.status === 401 || err.status === 403 || err.status === 429) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
}

module.exports = { register, login };
