import type { ProductAttributes } from "../interface/ProductInterface";
import Products from "../models/ProductModel"
import Users from "../models/UserModel";
import { Op } from "sequelize";

export const getProducts = async (req: any, res: any) => {
    try {
        let response;
        if (req.role === 'ADMIN') {
            response = await Products.findAll({
                attributes: ['uuid', 'name', 'price'],
                include: {
                    attributes: ['name', 'email'],
                    model: Users
                }
            });
        } else {
            response = await Products.findAll({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    userId: req.userId
                },
                include: {
                    attributes: ['name', 'email'],
                    model: Users
                }
            });
        }
        res.status(200).json(response)
    } catch (error: any) {
        res.status(500).json({msg: error.message})
    }
}

export const getProductsById = async (req: any, res: any) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        }) as ProductAttributes | null;

        if (!product) res.status(404).json({
            msg: "Product not found."
        });

        let response;
        if (req.role === 'ADMIN') {
            response = await Products.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    id: product?.id
                },
                include: {
                    attributes: ['name', 'email'],
                    model: Users
                }
            });
        } else {
            response = await Products.findOne({
                attributes: ['uuid', 'name', 'price'],
                where: {
                    [ Op.and ]: [{id: product?.id}, {userId: req.userId}]
                },
                include: {
                    attributes: ['name', 'email'],
                    model: Users
                }
            });
        }
        res.status(200).json(response);
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}

export const createProduct = async (req: any, res: any) => {
    const { name, price } = req.body;

    try {
        await Products.create({
            name: name,
            price: price,
            userId: req.userId
        });

        res.status(201).json({
            msg: "Product created."
        });
    } catch (error: any) {
        res.status(400).json({
            msg: error.message
        });
    }
}

export const updateProduct = async (req: any, res: any) => {
    try {
        const product = await Products.findOne({
            where: {
                uuid: req.params.id
            }
        }) as ProductAttributes | null;

        if (!product) res.status(404).json({
            msg: "Product not found."
        });

        const { name, price } = req.body;
        if (req.role === 'ADMIN') {
            await Products.update({
                name: name,
                price: price
            }, {
                where: {
                    id: product?.id
                }
            });
        } else {
            if (req.userId !== product?.userId) res.status(403).json({
                msg: "Forbidden."
            });

            await Products.update({
                name: name,
                price: price
            }, {
                where: {
                    [ Op.and ]: [{id: product?.id}, {userId: req.userId}]
                }
            });
            
        }
        res.status(200).json({
            msg: "Product updated."
        });
    } catch (error: any) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteProduct = async (req: any, res: any) => {
    const product = await Products.findOne({
        where: {
            uuid: req.params.id
        }
    }) as ProductAttributes | null;

    if (!product) return res.status(404).json({
        msg: "Product not found."
    })

    try {
        await Products.destroy({
            where: {
                id: product.id
            }
        })
        res.status(201).json({
            msg: "Product deleted."
        })
    } catch (error: any) {
        res.status(400).json({
            msg: error.message
        })
    }
}