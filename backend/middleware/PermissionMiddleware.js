
// Permission constants untuk konsistensi
export const PERMISSIONS = {
    // Product Management
    CREATE_PRODUCT: 'create_product',
    EDIT_PRODUCT: 'edit_product',
    DELETE_PRODUCT: 'delete_product',
    MANAGE_STOCK: 'manage_stock',
    
    // Category Management
    CREATE_CATEGORY: 'create_category',
    EDIT_CATEGORY: 'edit_category',
    DELETE_CATEGORY: 'delete_category',
    
    // Order Management
    VIEW_ORDERS: 'view_orders',
    UPDATE_ORDER_STATUS: 'update_order_status',
    CANCEL_ORDER: 'cancel_order',
    
    // User Management
    VIEW_USERS: 'view_users',
    EDIT_USERS: 'edit_users',
    DELETE_USERS: 'delete_users',
    
    // Admin Management
    CREATE_ADMIN: 'create_admin',
    EDIT_ADMIN: 'edit_admin',
    DELETE_ADMIN: 'delete_admin',
    
    // Reports
    VIEW_REPORTS: 'view_reports',
    EXPORT_REPORTS: 'export_reports',
    
    // System Settings
    MANAGE_SETTINGS: 'manage_settings',
    VIEW_LOGS: 'view_logs'
};

// Default permissions untuk staff
export const DEFAULT_STAFF_PERMISSIONS = {
    [PERMISSIONS.VIEW_ORDERS]: true,
    [PERMISSIONS.UPDATE_ORDER_STATUS]: true,
    [PERMISSIONS.MANAGE_STOCK]: true,
    [PERMISSIONS.VIEW_REPORTS]: true,
    [PERMISSIONS.VIEW_USERS]: true
};

// Function untuk check permission
export const checkPermission = (permission) => {
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
                    message: `Insufficient permissions. '${permission}' required.`,
                    required_permission: permission
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Permission check error",
                error: error.message
            });
        }
    };
};

// Function untuk check multiple permissions (AND logic)
export const checkAllPermissions = (permissions) => {
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

            // Check all required permissions for staff
            const userPermissions = req.admin.permissions || {};
            const missingPermissions = permissions.filter(permission => !userPermissions[permission]);

            if (missingPermissions.length > 0) {
                return res.status(403).json({
                    success: false,
                    message: `Insufficient permissions. Missing: ${missingPermissions.join(', ')}`,
                    missing_permissions: missingPermissions
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Permission check error",
                error: error.message
            });
        }
    };
};
