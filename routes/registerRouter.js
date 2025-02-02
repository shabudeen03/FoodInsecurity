const { Router } = require('express');
const registerRouter = Router();

const registerController = require('../controllers/registerController.js');

registerRouter.get("/", registerController.getRegister);

registerRouter.post("/", registerController.validator, registerController.postRegister);

module.exports = { registerRouter };