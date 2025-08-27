import { Op } from "sequelize";
import Product from "../models/Product.js";
import Category from "../models/Category.js";


export const getAllProducts = async (req,res) => {
    const {
        page = 1,
        search = '',
        order = 'asc',
        limit = 10,
        sort = 'product_id'
    } = req.query;

    const offset = (page - 1 ) * limit;
    try {
        const { count, rows } = await Product.findAndCountAll({
            where:{
                name: {[Op.like]: `%${search}%`}
            },
            order:[[sort, order]],
            limit: parseInt(limit),
            offset: parseInt(offset),
            include:[
                {
                    model: Category,
                    attributes:[
                        'category_id',
                        'name'
                    ]
                }
            ]
        });
        res.json({
            totalItems : count,
            totalPages : Math.ceil(count/limit),
            currentPage: parseInt(page),
            data: rows
        })
    } catch (error) {
        console.log(error.message)
    }
}


export const getProductById = async (req,res) => {
    try {
        const response = await Product.findOne({
            where:{
                product_id: req.params.product_id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const createProduct = async (req,res) => {
    try {
        await Product.create(req.body);
        res.status(201).json({msg:'Congratss, Product created !!'})
    } catch (error) {
        console.log(error.message)
    }
}


export const updateProduct = async (req,res) => {
    try {
        await Product.update(req.body, {
            where:{
                product_id: req.params.product_id
            }
        })
        res.status(200).json({msg:'Yoshhh, the product has been updated ! yey'})
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteProduct = async (req,res) => {
    try {
        await Product.destroy({
            where:{
                product_id: req.params.product_id
            }
        })
        res.status(200).json({msg:'Sorry, Products has no longer!!'})
    } catch (error) {
        
    }
}