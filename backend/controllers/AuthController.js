import Admin from "../models/Admin.js";
import User from "../models/Users.js";
import argon2 from 'argon2'





export const loginUser = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and Password are required!!'
            })
        }
        const user = await User.findOne({
            where: {
                email: email,
                is_active: true
            }
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const isValidPassword = await argon2.verify(user.password, password)

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        req.session.userId = user.user_id;
        req.session.userType = 'customer';

        res.status(200).json({
            success: true,
            message: 'Login Successfully',
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
            message: 'Internal server error',
            error: error.message
        })
    }

}




export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const admin = await Admin.findOne({
            where: { 
                email: email, 
                is_active: true 
            }
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isValidPassword = await argon2.verify(admin.password, password);
        
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Store admin session
        req.session.adminId = admin.admin_id;
        req.session.userType = 'admin';
        req.session.role = admin.role;

        res.status(200).json({
            success: true,
            message: "Admin login successful",
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



export const getMe = async (req, res) => {
    try {
        if (req.session.userType === 'customer' && req.session.userId) {
            const user = await User.findByPk(req.session.userId, {
                attributes: ['user_id', 'name', 'email', 'phone', 'address', 'createdAt']
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user_type: 'customer',
                    ...user.toJSON()
                }
            });
        }

        if (req.session.userType === 'admin' && req.session.adminId) {
            const admin = await Admin.findByPk(req.session.adminId, {
                attributes: ['admin_id', 'name', 'email', 'role', 'permissions', 'createdAt']
            });

            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found"
                });
            }

            return res.status(200).json({
                success: true,
                data: {
                    user_type: 'admin',
                    ...admin.toJSON()
                }
            });
        }

        res.status(401).json({
            success: false,
            message: "Not authenticated"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Could not log out"
                });
            }

            res.clearCookie('connect.sid');
            res.status(200).json({
                success: true,
                message: "Logout successful"
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
