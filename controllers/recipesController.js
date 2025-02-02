const pool = require('../database/pool.js');

const getRecipes = async (req, res) => {
    // const { rows } = await pool.query("SELECT * FROM recipes");
    const { rows } = await pool.query("SELECT * FROM users RIGHT JOIN recipes ON users.id = recipes.userid");
    // console.log(rows);
    res.render("recipes/home", { user: req.user, rows: rows });
};

const viewRecipe = async (req, res) => {
    // const { rows } = await pool.query("SELECT * FROM recipes WHERE id = $1", [req.params.id]);
    const { rows } = await pool.query("SELECT * FROM users RIGHT JOIN recipes ON users.id = recipes.userid WHERE recipes.id = $1", [req.params.id]);

    if(rows[0]) {
        // console.log(rows[0]);
        return res.render("recipes/viewRecipe", { recipe: rows[0], user: req.user });
    }

    res.redirect("/recipes");
}; 

const getAddRecipeForm = (req, res) => {
    res.render("recipes/addRecipe", { user: req.user });
};  

const postRecipe = async (req, res) => {
    if(req.body.recipeName.length === 0 || req.body.recipeDetails.length === 0) {
        return res.redirect("/recipes/add"); 
    }

    await pool.query("INSERT INTO recipes(title, text, userid) VALUES ($1, $2, $3)", [req.body.recipeName, req.body.recipeDetails, req.user.id]);
    res.redirect("/recipes");
};

const updateRecipe = (req, res) => {
    res.send("Recipe updated");
};

const deleteRecipe = async (req, res) => {
    // console.log("DELETE");
    const recipeId = req.params.rid;
    // console.log(recipeId + ": " + typeof recipeId);
    await pool.query("DELETE FROM recipes WHERE id=$1", [recipeId]);
    res.redirect("/recipes");
};

module.exports = {
    getRecipes,
    viewRecipe,
    getAddRecipeForm,
    postRecipe,
    updateRecipe,
    deleteRecipe
};