import { db } from "./db.js";
import bcrypt from "bcrypt";

const run = async () => {
  const hash = await bcrypt.hash("1234", 10);

  db.run("INSERT OR IGNORE INTO users (id, name, password) VALUES (?, ?, ?)",
    1,
    "albiyan",
    hash
  );

  db.run("INSERT OR IGNORE INTO restaurants (id, name) VALUES (?, ?)",
    1,
    "baraya",
  );

  db.run("INSERT OR IGNORE INTO menus (id, name, restaurant_id, price) VALUES (?, ?, ?, ?)",
    1,
    "galunggung",
    1,
    25000
  );
  
  // Add more sample menus with prices
  db.run("INSERT OR IGNORE INTO menus (id, name, restaurant_id, price) VALUES (?, ?, ?, ?)",
    2,
    "nasi goreng",
    1,
    20000
  );
  
  db.run("INSERT OR IGNORE INTO menus (id, name, restaurant_id, price) VALUES (?, ?, ?, ?)",
    3,
    "mie ayam",
    1,
    18000
  );

  console.log("seeding done");
};

run();
