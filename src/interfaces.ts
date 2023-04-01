interface IProduct {
    id: number;
    name: string;
    price: number;
    weight: number;
    section: 'food' | 'cleaning';
    expirationDate: Date ;
}

type TCleaningProductRequest = Omit<IProduct, 'id' | 'expirationDate'>

interface IFoodProduct extends IProduct {
    calories: number
}

type TFoodProductRequest = Omit<IFoodProduct, 'id' | 'expirationDate'>

interface ICleaningProduct  extends IProduct{}

export {
    IProduct,
    IFoodProduct,
    ICleaningProduct,
    TCleaningProductRequest,
    TFoodProductRequest
}