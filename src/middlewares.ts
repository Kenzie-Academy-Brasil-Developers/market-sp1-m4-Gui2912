import { NextFunction, Request, Response } from "express";
import market from "./database";
import {
    ICleaningProduct,
    IFoodProduct,
    IProduct,
    TCleaningProductRequest,
    TFoodProductRequest,
} from "./interfaces";

const ensureNameIsUnique = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    const product: Array<TCleaningProductRequest | TFoodProductRequest> =
        req.body;

    const productNames: Array<string> = product.map((prod) => prod.name);

    const ensureProductNameIsUnique: boolean = market.some((elt) =>
        productNames.includes(elt.name)
    );

    if (ensureProductNameIsUnique) {
        return res.status(409).json({
            error: "Product already registered",
        });
    }

    res.locals.product = product ;

    return next();
};

const ensureProductExists = (
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    const id: number = +req.params.id;

    const findedProduct: IFoodProduct | ICleaningProduct | undefined =
        market.find((product) => product.id === id);
    if (!findedProduct) {
        return res.status(404).json({
            error: "Product not found",
        });
    }

    res.locals.findedProduct = findedProduct

    res.locals.id = id

    return next();
};

const ensureDataIsValid = (req:Request, res:Response, next:NextFunction): Response | void => {
  const data = res.locals.product
  
  return next()
}

export { ensureNameIsUnique, ensureProductExists, ensureDataIsValid };
