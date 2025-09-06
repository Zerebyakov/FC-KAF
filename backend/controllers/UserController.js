import argon2 from 'argon2'
import User from '../models/Users.js'
import Address from '../models/Address.js'


export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            address
        } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await argon2.hash(password);
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            address
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                'user_id',
                'name',
                'email',
                'phone',
                'address',
                'is_active',
                'createdAt'
            ],
            include: [
                {
                    model: Address,
                    attributes: [
                        'address_id',
                        'label',
                        'full_address',
                        'is_default'
                    ]
                }
            ]
        });

        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const getUserById = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const user = await User.findByPk(id, {
            attributes: [
                'user_id',
                'name',
                'email',
                'phone',
                'address',
                'is_active',
                'createdAt'
            ],
            include: [
                {
                    model: Address,
                    attributes: [
                        'address_id',
                        'label',
                        'full_address',
                        'is_default'
                    ]
                }
            ]
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}



export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await user.update({
            name: name || user.name,
            email: email || user.email,
            phone: phone || user.phone,
            address: address || user.address
        });

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Soft delete
        await user.update({ is_active: false });

        res.status(200).json({
            success: true,
            message: "User deactivated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



