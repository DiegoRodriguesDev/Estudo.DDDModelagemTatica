import Product from "../entity/product"

export default class ProductService {

    static increasePrice(products: Product[], percentage: number): void {
        products.forEach(product => {
            const priceCalculated = product.price * ((percentage / 100) + 1);
            product.changePrice(priceCalculated);
        })
    }

}