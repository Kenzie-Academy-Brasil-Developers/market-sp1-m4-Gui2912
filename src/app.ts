import express, { Application } from "express";
import { createProduct, deleteProduct, listProductById, listProducts, updateProduct } from "./logics";
import { ensureDataIsValid, ensureNameIsUnique, ensureProductExists } from "./middlewares";

const app: Application = express();
app.use(express.json());

app.post("/products", ensureNameIsUnique,ensureDataIsValid, createProduct);
app.get("/products", listProducts)
app.get("/products/:id",ensureProductExists, listProductById)
app.patch("/products/:id", ensureProductExists, updateProduct)
app.delete("/products/:id", ensureProductExists, deleteProduct)


app.listen(3000, () => {
    console.log("Server is running");
});
