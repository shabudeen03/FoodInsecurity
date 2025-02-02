const { Client } = require("pg");

const SQL = `
    DROP TABLE recipes;
    DROP TABLE inventory;
    DROP TABLE comms;
    DROP TABLE users;
    DROP TABLE orgs;

    CREATE TABLE IF NOT EXISTS orgs (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 255 ) NOT NULL,
        email VARCHAR ( 255 ) NOT NULL,
        phone VARCHAR ( 255 ) NOT NULL,
        location VARCHAR ( 255 ) NOT NULL,
        description VARCHAR ( 255 ) NOT NULL,
        news VARCHAR ( 255 ),
        created DATE DEFAULT CURRENT_DATE
    );

    INSERT INTO orgs(name, email, phone, location, description) VALUES
        ('SBU Food Pantry', 'sbu@sbu.com', '917-289-3133', 'Stony Brook Univeristy, Long Island, New York 10987', 'Food Pantry that offers students various food items including lifestyle conveniences')
    ;

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR ( 255 ) UNIQUE NOT NULL,
        firstname VARCHAR ( 255 ) NOT NULL,
        lastname VARCHAR ( 255 ) NOT NULL,
        email VARCHAR ( 255 ) NOT NULL,
        phone VARCHAR ( 255 ),
        password VARCHAR ( 255 ) NOT NULL,
        location VARCHAR ( 255 ),
        status VARCHAR ( 255 ) NOT NULL,
        pantryID INTEGER NOT NULL REFERENCES orgs (id) DEFAULT 1,
        created DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR ( 255 ) NOT NULL,
        quantity INT NOT NULL,
        description VARCHAR ( 255 ) NOT NULL,
        pantryID INTEGER NOT NULL REFERENCES orgs (id),
        created DATE DEFAULT CURRENT_DATE
    );

    INSERT INTO inventory(name, quantity, description, pantryID) VALUES
        ('Milk', 10, 'Dairy,Calcium-rich,High Protein,Low Fat', 1),
        ('Chocolate Bar', 25, 'Snack,High Sugar,Contains Dairy,Contains Nuts', 1),
        ('Canned Beans', 40, 'High Fiber,Protein-rich,Low Fat,Vegan', 1),
        ('Rice', 50, 'Gluten-free,Carbohydrates,Low Sodium,Versatile', 1),
        ('Peanut Butter', 30, 'Protein-rich,Contains Nuts,High Calories,Gluten-free', 1),
        ('Cereal', 20, 'Whole Grains,Fortified with Vitamins,Low Fat,Quick Breakfast', 1),
        ('Canned Tuna', 35, 'Protein-rich,Low Fat,Omega-3 Fatty Acids,Low Carb', 1),
        ('Pasta', 45, 'Carbohydrates,Quick Cooking,Low Sodium,Budget-friendly', 1),
        ('Tomato Sauce', 25, 'Vegan,Low Calorie,Rich in Vitamin C,No Artificial Additives', 1),
        ('Bread', 20, 'Whole Grain,Low Fat,Contains Gluten,Good Fiber', 1),
        ('Applesauce', 15, 'No Added Sugar,Low Calorie,Rich in Vitamin C,Kid-friendly', 1),
        ('Oatmeal', 30, 'Whole Grain,High Fiber,Low Fat,Heart Healthy', 1),
        ('Vegetable Oil', 10, 'Rich in Healthy Fats,Cooking Essential,No Trans Fat,High Calorie', 1),
        ('Canned Corn', 25, 'Gluten-free,High Fiber,Naturally Sweet,Low Fat', 1),
        ('Canned Soup', 20, 'Convenient,Ready-to-Eat,Low Fat Options,Rich in Sodium', 1),
        ('Instant Noodles', 50, 'Quick Meal,High Sodium,Carbohydrates,Budget-friendly', 1),
        ('Granola Bars', 40, 'Snack,Whole Grains,Portable,Contains Nuts', 1),
        ('Canned Vegetables', 30, 'Vegan,Rich in Vitamins,Low Calorie,High Fiber', 1),
        ('Flour', 25, 'Baking Essential,Contains Gluten,Carbohydrates,Versatile', 1),
        ('Sugar', 15, 'Sweetener,High Calorie,No Fiber,Cooking Essential', 1)
    ;

    CREATE TABLE IF NOT EXISTS comms (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR ( 255 ) NOT NULL,
        text VARCHAR ( 1024 ),
        created DATE DEFAULT CURRENT_DATE 
    );

    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR ( 100 ) NOT NULL,
        text VARCHAR ( 1024 ) NOT NULL,
        userID INTEGER NOT NULL REFERENCES users (id),
        created DATE DEFAULT CURRENT_DATE
    );
`;

async function main() {
    console.log("Seeding ...");
    const client = new Client({
        connectionString: "postgresql://<your-username-here>:<your-password-here>@localhost:5432/<database-name>"
    });

    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("Done");
}

main(); 
