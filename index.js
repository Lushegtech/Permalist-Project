import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "@Caro07033",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function checkItems() {
  const result = await db.query("SELECT * FROM items ORDER BY id ASC;");
  return result.rows;
}

app.get("/", async (req, res) => {
  const items = await checkItems()

  try{
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
} catch(err){
  console.log(err);
  
}
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  
  try{
  await db.query( "INSERT INTO items (title) VALUES ($1);",
    [item]
  )
  // items.push({ title: item });
  res.redirect("/");
} catch(err){
  console.log(err);
}
});

app.post("/edit", async (req, res) => {
  const itemId  = req.body.updatedItemId;
  const data = req.body.updatedItemTitle;

  try {
  await db.query(`UPDATE items
    SET title = ($1)
    WHERE id = $2;`,
    [data, itemId]
  )

  res.redirect("/");
} catch(err){
  console.log(err);
}
});

app.post("/delete", async (req, res) => {
  const itemId = req.body.deleteItemId;

  await db.query("DELETE FROM items WHERE id = $1;",
    [itemId]
  )

  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});