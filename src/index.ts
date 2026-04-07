import express from "express";
import type { Request, Response } from "express";

const app = express();
const port = 3000;

const products = [
  { id: 1, title: "totamo" },
  { id: 2, title: "bulba" },
];
const addresses = [
  { id: 1, value: "Hmelnitskogo" },
  { id: 2, value: "Omskaya" },
];

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

app.get("/products", (req: Request, res: Response) => {
  let results = products;
  const { query } = req;

  if (typeof query.title === "string") {
    results = results.filter((p) => p.title.includes(String(query.title)));
  }

  res.send(results);
});

app.delete("/products/:id", (req: Request, res: Response) => {
  const idToRemove = products.findIndex((p) => p.id === Number(req.params.id));
  if (idToRemove === -1) {
    res.status(404).send("Product not found");
    return;
  }
  products.splice(idToRemove, 1);
  res.status(204);
});

app.post("/products", (req: Request, res: Response) => {
  const newProduct = req.body;
  if (!newProduct.id) {
    newProduct.id = products.length + 1;
  }
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.get("/products/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const p = products.find((p) => p.id === id);
  if (!p) {
    res.status(404).send("Product not found");
    return;
  }

  res.json(p);
});

app.put("/products/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const p = products.find((p) => p.id === id);
  if (!p) {
    res.status(404).send("Product not found");
    return;
  }
  p.title = req.body.title;
  res.json(p);
});

app.get("/addresses", (req: Request, res: Response) => {
  res.send(addresses);
});

app.get("/address/:id", (req: Request, res: Response) => {
  const id = req.params.id;

  let result = addresses.find((a) => a.id === Number(id));
  if (result) {
    res.send(result);

    return;
  }

  res.status(404).send(`Not found address with id ${id}`);
});

app.get("/", (req: Request, res: Response) => {
  let helloMsg = "hello samurai";
  res.send(helloMsg);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
