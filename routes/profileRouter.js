const { Router } = require('express');
const profileRouter = Router();

const profileController = require('../controllers/profileController.js');
 
profileRouter.get("/", profileController.getProfile);

profileRouter.get("/delete", profileController.deleteProfile);

profileRouter.get("/disable", profileController.disableProfile);

profileRouter.get("/enable", profileController.enableProfile);

module.exports = { profileRouter }; 