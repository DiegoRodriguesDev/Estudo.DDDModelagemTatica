import Product from "../../domain/entity/product";
import ProductRepositoryInterface from "../../domain/repository/product-repository.interface";
import ProductModel from "../db/sequelize/models/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
    
    async create(entity: Product): Promise<void> {
        
        await ProductModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price
        });
        
    }
    update(entity: Product): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Product> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

}