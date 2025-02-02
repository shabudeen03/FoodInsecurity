const { query, validationResult } = require('express-validator');
const pool = require('../database/pool.js');

const search = async (name, quantity, description, pantryID) => {
    // const isValidName = (name.length > 0) ? /^[A-Za-z\s]+$/i.test(name) : false;
    // const isValidQuantity = (quantity.length > 0) ? /^[0-9]+$/.test(quantity) : false;
    // const isValidDesc = (description.length > 0) ? /^[A-Za-z\s]+$/i.test(description) : false;

    // if(!isValidName && !isValidQuantity && !isValidDesc) {
    //     return null;
    // }

    let ctr = 2;
    let query = "SELECT * FROM inventory WHERE pantryid = $1";
    let queryValues = [pantryID];

    let textSearch = 0;
    let clause = "";
    let nclause = "";
    if(name.length > 0) {
        textSearch++;
        nclause += ` name ILIKE ANY ($${ctr++}::text[]) `;

        let queryName = name.split(" ");
        let formattedName = queryName.map(term => `%${term}%`);
        queryValues.push(formattedName);
    }

    let dclause = "";
    if(description.length > 0) {
        dclause += ` description ILIKE ANY ($${ctr++}::text[]) `;
        if(textSearch > 0) clause = ' AND ( ' + nclause + ' OR ' + dclause + ' ) ';
        else {
            clause += " AND " + dclause;
        }

        textSearch++;

        let queryDesc = description.split(" ");
        let formattedDesc = queryDesc.map(term => `%${term}%`);
        queryValues.push(formattedDesc);
    } else if(nclause.length > 0) {
        clause += " AND " + nclause;
    }

    if(quantity.length > 0) {
        let targetNum = Number(quantity);
        clause += ` AND quantity >= $${ctr}`;
        queryValues.push(targetNum);
    }

    query += clause;
    // console.log("QUERY: " + query);
    const { rows } = await pool.query(query, queryValues);
    return rows;
};

const filterValidator = [
    query('dash_name_search')
        .optional({ values: 'falsy' })
        .trim()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Item name must be valid (no digits).'),

    query('dash_qty_search')
        .optional({ values: 'falsy' })
        .trim()
        .isInt({ min: 0 })
        .withMessage('Minimum Quantity must be digits only.'),

    query('dash_desc_search')
        .optional({ values: 'falsy' })
        .trim()
        .matches(/^[A-Za-z\s]+$/)
        .withMessage('Must be valid description tags (letters only, each separated by space).')
];

const getDashboardPage = async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM inventory WHERE pantryid = $1", [req.params.pid]);
    const items = rows;

    let newItems = [];
    let name = "Not Set.";
    let qty = "Not Set.";
    let desc = "Not Set.";
    const result = validationResult(req);

    // req.query will contain no key-value pairs from the form if it is a simple get request
    // result.errors.length is 0 on default get requests too
    if(Object.values(req.query).length > 0 && result.errors.length === 0) {
        let retCode = await search(req.query.dash_name_search, req.query.dash_qty_search, req.query.dash_desc_search, req.params.pid);
        if(retCode == null) newItems = items;
        else newItems = retCode;

        if(req.query.dash_name_search !== "") {
            name = req.query.dash_name_search;
        }

        if(req.query.dash_desc_search !== "") {
            desc = req.query.dash_desc_search;
        }

        if(req.query.dash_qty_search !== "") {
            qty = req.query.dash_qty_search;
        }

        // console.log(newItems);
    } else {
        newItems = items;
        name = "Not Set.";
        qty = "Not Set.";
        desc = "Not Set.";
    }

    res.render("dashboard", { 
        user: req.user,
        items: newItems, 
        filterName: name, 
        filterQty: qty, 
        filterDesc: desc, 
        errors:result.errors 
    }); 
};
 
module.exports = { getDashboardPage, filterValidator };