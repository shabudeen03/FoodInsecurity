const { Router } = require('express');
const dashboardRouter = Router();

const dashboardController  = require('../controllers/dashboardController.js');

dashboardRouter.get("/:pid", dashboardController.filterValidator, dashboardController.getDashboardPage);
// dashboardRouter.post("/", dashboardController.getDashboardPage);

module.exports = { dashboardRouter };