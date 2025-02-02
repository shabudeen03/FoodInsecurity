const { Router } = require('express');
const recipesRouter = Router();

const recipesController = require("../controllers/recipesController.js");

recipesRouter.get("/", recipesController.getRecipes);

recipesRouter.get("/add", recipesController.getAddRecipeForm);

recipesRouter.get("/view/:id", recipesController.viewRecipe);

recipesRouter.get("/delete/:rid", recipesController.deleteRecipe);

recipesRouter.post("/add", recipesController.postRecipe);

recipesRouter.post("/update/:rid", recipesController.updateRecipe);

module.exports = { recipesRouter };