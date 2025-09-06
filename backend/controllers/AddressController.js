import { Op } from "sequelize";
import Address from "../models/Address.js";



export const createAddress = async (req, res) => {
    try {
        const { label, recipient_name, phone, full_address, city, postal_code, latitude, longitude, is_default } = req.body;
        const user_id = req.session.userId;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        if (!label || !recipient_name || !phone || !full_address || !city) {
            return res.status(400).json({
                success: false,
                message: "Required fields: label, recipient_name, phone, full_address, city"
            });
        }

        // If this is set as default, unset other default addresses
        if (is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id } }
            );
        }

        const address = await Address.create({
            user_id,
            label,
            recipient_name,
            phone,
            full_address,
            city,
            postal_code,
            latitude,
            longitude,
            is_default: is_default || false
        });

        res.status(201).json({
            success: true,
            message: "Address created successfully",
            data: address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getUserAddresses = async (req, res) => {
    try {
        const user_id = req.session.userId;

        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const addresses = await Address.findAll({
            where: { user_id, is_active: true },
            order: [['is_default', 'DESC'], ['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: addresses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, recipient_name, phone, full_address, city, postal_code, latitude, longitude, is_default } = req.body;
        const user_id = req.session.userId;

        const address = await Address.findOne({
            where: { address_id: id, user_id }
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        // If this is set as default, unset other default addresses
        if (is_default) {
            await Address.update(
                { is_default: false },
                { where: { user_id, address_id: { [Op.ne]: id } } }
            );
        }

        await address.update({
            label: label || address.label,
            recipient_name: recipient_name || address.recipient_name,
            phone: phone || address.phone,
            full_address: full_address || address.full_address,
            city: city || address.city,
            postal_code: postal_code || address.postal_code,
            latitude: latitude || address.latitude,
            longitude: longitude || address.longitude,
            is_default: is_default !== undefined ? is_default : address.is_default
        });

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            data: address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.session.userId;

        const address = await Address.findOne({
            where: { address_id: id, user_id }
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        await address.update({ is_active: false });

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
