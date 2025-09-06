import User from "../models/Users.js";
import Admin from "../models/Admin.js";





// Middleware untuk memastikan user sudah login (customer)
export const requireAuth = async (req, res, next) => {
    try {
        if (!req.session || !req.session.userId || req.session.userType !== 'customer') {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login first."
            });
        }

        // Verify user still exists and is active
        const user = await User.findOne({
            where: { 
                user_id: req.session.userId,
                is_active: true 
            },
            attributes: ['user_id', 'name', 'email', 'phone']
        });

        if (!user) {
            // Clear invalid session
            req.session.destroy();
            return res.status(401).json({
                success: false,
                message: "User account not found or inactive. Please login again."
            });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message
        });
    }
};



// Middleware untuk memastikan admin sudah login
export const requireAdminAuth = async (req, res, next) => {
    try {
        if (!req.session || !req.session.adminId || req.session.userType !== 'admin') {
            return res.status(401).json({
                success: false,
                message: "Admin authentication required. Please login first."
            });
        }

        // Verify admin still exists and is active
        const admin = await Admin.findOne({
            where: { 
                admin_id: req.session.adminId,
                is_active: true 
            },
            attributes: ['admin_id', 'name', 'email', 'role', 'permissions']
        });

        if (!admin) {
            // Clear invalid session
            req.session.destroy();
            return res.status(401).json({
                success: false,
                message: "Admin account not found or inactive. Please login again."
            });
        }

        // Attach admin to request object
        req.admin = admin;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message
        });
    }
};



// Middleware untuk memastikan hanya admin yang bisa akses (bukan staff)
export const requireAdminRole = (req, res, next) => {
    try {
        if (!req.admin || req.admin.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin role required. Access denied."
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authorization error",
            error: error.message
        });
    }
};


// Middleware untuk memastikan admin atau staff (keduanya bisa akses)
export const requireStaffAccess = (req, res, next) => {
    try {
        if (!req.admin || !['admin', 'staff'].includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: "Staff access required. Access denied."
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authorization error",
            error: error.message
        });
    }
};



// Middleware untuk check permission berdasarkan permission JSON
export const requirePermission = (permission) => {
    return (req, res, next) => {
        try {
            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: "Admin authentication required"
                });
            }

            // Admin role has all permissions
            if (req.admin.role === 'admin') {
                return next();
            }

            // Check specific permission for staff
            const permissions = req.admin.permissions || {};
            
            if (!permissions[permission]) {
                return res.status(403).json({
                    success: false,
                    message: `Permission '${permission}' required. Access denied.`
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Authorization error",
                error: error.message
            });
        }
    };
};


// Middleware untuk check multiple permissions (OR logic)
export const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        try {
            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: "Admin authentication required"
                });
            }

            // Admin role has all permissions
            if (req.admin.role === 'admin') {
                return next();
            }

            // Check if user has any of the required permissions
            const userPermissions = req.admin.permissions || {};
            const hasPermission = permissions.some(permission => userPermissions[permission]);

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: `One of these permissions required: ${permissions.join(', ')}. Access denied.`
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Authorization error",
                error: error.message
            });
        }
    };
};


// Middleware untuk memastikan user hanya bisa akses data mereka sendiri
export const requireOwnership = (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.session.userId;

        // Allow if user is accessing their own data
        if (parseInt(id) === user_id) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: "Access denied. You can only access your own data."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authorization error",
            error: error.message
        });
    }
};

// Middleware untuk check apakah user atau admin yang akses
export const requireUserOrAdmin = async (req, res, next) => {
    try {
        // Check if it's a customer
        if (req.session.userType === 'customer' && req.session.userId) {
            const user = await User.findOne({
                where: { 
                    user_id: req.session.userId,
                    is_active: true 
                },
                attributes: ['user_id', 'name', 'email']
            });

            if (user) {
                req.user = user;
                req.userType = 'customer';
                return next();
            }
        }

        // Check if it's an admin
        if (req.session.userType === 'admin' && req.session.adminId) {
            const admin = await Admin.findOne({
                where: { 
                    admin_id: req.session.adminId,
                    is_active: true 
                },
                attributes: ['admin_id', 'name', 'email', 'role', 'permissions']
            });

            if (admin) {
                req.admin = admin;
                req.userType = 'admin';
                return next();
            }
        }

        return res.status(401).json({
            success: false,
            message: "Authentication required. Please login first."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message
        });
    }
};


// Middleware untuk optional auth (tidak wajib login)
export const optionalAuth = async (req, res, next) => {
    try {
        // Try to get user if logged in
        if (req.session && req.session.userId && req.session.userType === 'customer') {
            const user = await User.findOne({
                where: { 
                    user_id: req.session.userId,
                    is_active: true 
                },
                attributes: ['user_id', 'name', 'email']
            });

            if (user) {
                req.user = user;
                req.userType = 'customer';
            }
        }

        // Try to get admin if logged in
        if (req.session && req.session.adminId && req.session.userType === 'admin') {
            const admin = await Admin.findOne({
                where: { 
                    admin_id: req.session.adminId,
                    is_active: true 
                },
                attributes: ['admin_id', 'name', 'email', 'role']
            });

            if (admin) {
                req.admin = admin;
                req.userType = 'admin';
            }
        }

        // Continue regardless of auth status
        next();

    } catch (error) {
        // If there's an error, continue without auth
        next();
    }
};
