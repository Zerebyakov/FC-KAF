import { Op } from "sequelize";
import Customer from "../models/Customer.js";
import argon2 from 'argon2'

export const getCustomers = async (req, res) => {
    const {
        page = 1,
        search = '',
        limit = 10,
        sort = 'customer_id',
        order = 'asc'

    } = req.query;
    const offset = (page - 1) * limit;
    try {
        const { count, rows } = await Customer.findAndCountAll({
            where: {
                name: { [Op.like]: `%${search}%` }
            },
            order: [[sort, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        res.json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: rows
        })

    } catch (error) {
        console.log(error.message)
    }
}


export const getCustomerById = async (req, res) => {
    try {
        const response = await Customer.findOne({
            where: {
                customer_id: req.params.customer_id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}


export const createCustomer = async (req, res) => {
    const {
        name,
        email,
        password,
        confPassword,
        phone,
        address
    } = req.body;

    if (password !== confPassword) {
        return res.status(400).json({ msg: "Password and Confirm Password doesnt match" })
    }
    const hashPassword = await argon2.hash(password)
    try {
        await Customer.create({
            name: name,
            email: email,
            password: hashPassword,
            phone: phone,
            address: address
        })
        res.status(201).json({ msg: 'Congratss, user succesfully created !' })
    } catch (error) {
        console.log(error.message)
    }
}


export const updateCustomer = async (req, res) => {
    const customer = await Customer.findOne({
        where: {
            customer_id: req.params.customer_id
        }
    });
    if (!customer) {
        res.status(404).json({ msg: 'Sorry, maybe this is not ur account tbh' })
    }
    const {
        name,
        email,
        password,
        confPassword,
        phone,
        address
    } = req.body;

    let hashPassword;

    if (password === '' || password === null) {
        hashPassword = customer.password
    } else {
        hashPassword = await argon2.hash(password)
    }

    if (password !== confPassword) {
        return res.status(400).json({ msg: 'Sorry, Password and Confirm Password doesnt match' })
    }

    try {
        await Customer.update({
            name: name,
            email: email,
            password: hashPassword,
            phone: phone,
            address: address
        }, {
            where: {
                customer_id: customer.customer_id
            }
        })
        res.status(200).json({ msg: 'Congrats, customer updated !!' })
    } catch (error) {

    }
}


export const deleteCustomer = async (req, res) => {
    try {
        await Customer.destroy({
            where: {
                customer_id: req.params.customer_id
            }
        })

        res.status(200).json({ msg: 'Oh noo, good bye' })
    } catch (error) {
        console.log(error.message)
    }

}

