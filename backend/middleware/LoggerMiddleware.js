
// Request logger middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

    // Log user info if authenticated
    if (req.session) {
        if (req.session.userId) {
            console.log(`  -> Customer ID: ${req.session.userId}`);
        }
        if (req.session.adminId) {
            console.log(`  -> Admin ID: ${req.session.adminId} (${req.session.role})`);
        }
    }

    // Override res.json to log response
    const originalJson = res.json;
    res.json = function (data) {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);

        if (res.statusCode >= 400) {
            console.log(`  -> Error: ${data.message || 'Unknown error'}`);
        }

        return originalJson.call(this, data);
    };

    next();
};

// Admin action logger (untuk audit trail)
export const adminActionLogger = (action) => {
    return (req, res, next) => {
        // Store action info in request for later logging
        req.adminAction = {
            action,
            timestamp: new Date(),
            ip: req.ip,
            userAgent: req.get('User-Agent')
        };

        // Override res.json to log successful admin actions
        const originalJson = res.json;
        res.json = function (data) {
            if (res.statusCode < 400 && req.admin) {
                console.log(`[ADMIN ACTION] ${req.admin.name} (ID: ${req.admin.admin_id}) performed '${action}' at ${req.adminAction.timestamp.toISOString()}`);
                console.log(`  -> Route: ${req.method} ${req.originalUrl}`);
                console.log(`  -> IP: ${req.adminAction.ip}`);

                // Log specific details based on action
                if (req.params.id) {
                    console.log(`  -> Target ID: ${req.params.id}`);
                }
            }

            return originalJson.call(this, data);
        };

        next();
    };
};