const { Router } = require('express');
const contactRouter = Router();

const express = require('express');
contactRouter.use(express.json());

const controller = require('../controllers/contactController.js');

contactRouter.get('/', controller.getContact);
contactRouter.post("/", controller.postContact);

module.exports = { contactRouter };