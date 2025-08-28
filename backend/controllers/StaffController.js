import Staff from "../models/Staff.js";
import argon2 from 'argon2'

export const getAllStaff = async (req, res) => {
    try {
        const response = await Staff.findAll()
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}


export const getStaffById = async (req, res) => {
    try {
        const response = await Staff.findOne({
            where: {
                staff_id: req.params.staff_id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}


export const createStaff = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: 'Password and Confirm Password doenst match !' })
    const hashPassword = await argon2.hash(password)
    try {
        await Staff.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        })
        res.status(201).json({ msg: 'Staff has been created !!' })
    } catch (error) {
        console.log(error.message)
    }
}


export const updateStaff = async (req, res) => {
    const staff = await Staff.findOne({
        where: {
            staff_id: req.params.staff_id
        }
    });
    if (!staff) return res.status(404).json({ msg: 'Sorry, Staff doesnt exist !' })
    const {
        name,
        email,
        password,
        confPassword,
        role
    } = req.body;
    let hashPassword;

    if (password === '' || password === null) {
        hashPassword  = staff.password
    } else {
        hashPassword = await argon2.hash(password)
    }

    if(password !== confPassword) return res.status(400).json({msg:"Sorry, Password and Confirm Password doesnt match"})

    try {
        await Staff.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        },{
            where:{
                staff_id: staff.staff_id
            }
        })
        res.status(200).json({msg:'Congrats, staff updated !!'})
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteStaff = async (req,res) => {
    try {
        await Staff.destroy({
            where:{
                staff_id: req.params.staff_id
            }
        })
        res.status(200).json({msg:'Ohh nooo, the staff has fired!'})
    } catch (error) {
        console.log(error.message)
    }
}