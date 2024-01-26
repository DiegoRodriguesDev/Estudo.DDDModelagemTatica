import { Model as SequelizeModel } from "sequelize";
import { Column, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "products",
    timestamps: false,
})
export default class ProductModel extends SequelizeModel {
    @PrimaryKey
    @Column
    declare id: string;

    @Column({ allowNull: false })
    declare name: string

    @Column({ allowNull: false })
    declare price: number;
}