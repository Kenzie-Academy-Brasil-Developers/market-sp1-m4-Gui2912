import { Request, Response } from "express";
import {
    TFoodProductRequest,
    IProduct,
    IFoodProduct,
    ICleaningProduct,
    TCleaningProductRequest,
} from "./interfaces";
import market from "./database";

const createProduct = (req: Request, res: Response): Response => {
    const data: TFoodProductRequest[] = req.body;
    const totalPrice: number = data
        .map((element) => element.price)
        .reduce((acc, total) => acc + total, 0);
    const today = new Date();
    let lastId: number = market.length + 1;

    const newProducts: IFoodProduct[] = data.map(
        (foodProduct: TFoodProductRequest) => {
            const newProduct: IFoodProduct = {
                ...foodProduct,
                id: lastId,
                expirationDate: new Date(
                    today.getFullYear() + 1,
                    today.getMonth(),
                    today.getMinutes(),
                    today.getDate()
                ),
            };
            lastId++;
            return newProduct;
        }
    );

    market.push(...newProducts);

    return res.status(201).json({
        total: totalPrice,
        marketProducts: newProducts,
    });
};

const listProducts = (req: Request, res: Response): Response => {
    const totalPrice: number = market
        .map((element) => element.price)
        .reduce((acc, total) => acc + total, 0);

    return res.status(200).json({
        total: totalPrice,
        marketProducts: market,
    });
};

const listProductById = (req: Request, res: Response): Response => {
    const id: number = res.locals.id;
    const findedProduct: ICleaningProduct | IFoodProduct = market.find(
        (element) => element.id === id
    )!;

    return res.status(200).json(findedProduct);
};

const updateProduct = (req: Request, res: Response): Response => {
    const id = res.locals.id;
    const newInfos = req.body;

    const verifyNameIsUnique: boolean = market.some((elt) =>
        Object.values(newInfos).includes(elt.name)
    );

    if (verifyNameIsUnique) {
        return res.status(409).json({
            error: "Product already registered",
        });
    }

    const product = market[id - 1];

    const updatedProduct = {
        ...product,
        ...(({ id, section, expirationDate, ...rest }) => rest)(newInfos),
    };

    market[id - 1] = updatedProduct;

    return res.status(200).json(updatedProduct);
};

const deleteProduct = (req: Request, res: Response): Response => {
    const id: number = res.locals.id;

    market.splice(id - 1, 1);

    return res.status(204).json();
};

export {
    createProduct,
    listProducts,
    listProductById,
    deleteProduct,
    updateProduct,
};
