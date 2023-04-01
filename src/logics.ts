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
    const newInfos: any = req.body;

    const newInfosObj = {
        name: newInfos.name,
        price: newInfos.price,
        weight: newInfos.weight,
        calories: newInfos.calories
    }
    console.log(newInfosObj);
    

    const updatedProduct:IProduct = {
        ...market[id - 1],
        ...newInfosObj,
    };

    market[id - 1] = updatedProduct

    return res.status(200).json(market[id - 1]);
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
