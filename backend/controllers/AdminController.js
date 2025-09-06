import argon2 from 'argon2'
import Admin from '../models/Admin.js'



export const createAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            permissions
        } = req.body;


        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingAdmin = await Admin.findOne({
            where: {
                email
            }
        })

        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }
        const hashedPassword = await argon2.hash(password);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role,
            permissions
        });

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                admin_id: admin.admin_id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: ['admin_id', 'name', 'email', 'role', 'permissions', 'is_active', 'createdAt']
        });

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, permissions, password } = req.body;

        const admin = await Admin.findByPk(id);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const updateData = {
            name: name || admin.name,
            email: email || admin.email,
            role: role || admin.role,
            permissions: permissions || admin.permissions
        };

        if (password) {
            updateData.password = await argon2.hash(password);
        }

        await admin.update(updateData);

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: {
                admin_id: admin.admin_id,
                name: admin.name,
                email: admin.email,
                role: admin.role
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
