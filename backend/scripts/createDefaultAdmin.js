import Admin from "../models/Admin.js";
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { PERMISSIONS } from "../middleware/PermissionMiddleware.js";

dotenv.config();


const createDefaultAdmin = async () => {
    try {
        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        // Cek apakah admin sudah ada
        const existingAdmin = await Admin.findOne({ where: { email: defaultEmail } });
        if (existingAdmin) {
            console.log(`⚠️ Default admin already exists with email: ${defaultEmail}`);
            return;
        }

        // Hash password default
        const hashedPassword = await argon2.hash(defaultPassword);

        // Buat semua permission bernilai true
        const allPermissions = {};
        Object.values(PERMISSIONS).forEach(permission => {
            allPermissions[permission] = true;
        });

        // Simpan admin baru
        await Admin.create({
            name: "Super Admin",
            email: defaultEmail,
            password: hashedPassword,
            role: "admin",
            permissions: allPermissions
        });

        console.log("✅ Default admin created successfully!");
        console.log(`📧 Email: ${defaultEmail}`);
        console.log(`🔑 Password: ${defaultPassword}`);
        console.log("⚠️  Please change the password after first login!");
    } catch (error) {
        console.error("❌ Error creating default admin:", error.message);
    }
};

// Jalankan langsung jika dieksekusi via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
    createDefaultAdmin().then(() => process.exit(0));
}

export default createDefaultAdmin;
