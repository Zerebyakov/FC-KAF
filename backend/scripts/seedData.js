import dotenv from 'dotenv';
import db from '../config/Config.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import ProductAddon from '../models/ProductAddon.js';
import createDefaultAdmin from './createDefaultAdmin.js';


dotenv.config();


const seedData = async () => {
  try {
    console.log(' Starting database seeding...');

    await db.authenticate();
    console.log('Connected to database');

    // Jangan pakai force:true di production (hanya untuk reset dev)
    await db.sync(); 
    console.log(' Synced models with database');
    await createDefaultAdmin();
    console.log(' Seeding categories...');
    await Category.bulkCreate([
      { name: 'Fried Chicken', description: 'Ayam goreng dengan berbagai varian rasa', sort_order: 1 },
      { name: 'Beverages', description: 'Minuman segar dan panas', sort_order: 2 },
      { name: 'Side Dishes', description: 'Makanan pendamping', sort_order: 3 },
      { name: 'Desserts', description: 'Makanan penutup', sort_order: 4 }
    ], { ignoreDuplicates: true });
    console.log('Categories created');
    const friedChickenCat = await Category.findOne({ where: { name: 'Fried Chicken' } });
    const beverageCat = await Category.findOne({ where: { name: 'Beverages' } });
    const sideDishCat = await Category.findOne({ where: { name: 'Side Dishes' } });

    if (!friedChickenCat || !beverageCat || !sideDishCat) {
      throw new Error('One or more categories not found!');
    }
    console.log('🌱 Seeding products...');
    await Product.bulkCreate([
      { category_id: friedChickenCat.category_id, name: 'Original Crispy Chicken', description: 'Ayam goreng renyah dengan bumbu rahasia', base_price: 25000, stock_quantity: 50, preparation_time: 15 },
      { category_id: friedChickenCat.category_id, name: 'Spicy Hot Chicken', description: 'Ayam goreng pedas level maksimal', base_price: 28000, stock_quantity: 40, preparation_time: 15 },
      { category_id: friedChickenCat.category_id, name: 'Honey Glazed Chicken', description: 'Ayam goreng dengan glaze madu manis', base_price: 30000, stock_quantity: 35, preparation_time: 18 },
      { category_id: beverageCat.category_id, name: 'Es Teh Manis', description: 'Teh manis dingin segar', base_price: 5000, stock_quantity: 100, preparation_time: 2 },
      { category_id: beverageCat.category_id, name: 'Jus Jeruk Fresh', description: 'Jus jeruk segar tanpa pengawet', base_price: 12000, stock_quantity: 50, preparation_time: 5 },
      { category_id: sideDishCat.category_id, name: 'Nasi Putih', description: 'Nasi putih pulen', base_price: 8000, stock_quantity: 200, preparation_time: 1 },
      { category_id: sideDishCat.category_id, name: 'French Fries', description: 'Kentang goreng renyah', base_price: 15000, stock_quantity: 80, preparation_time: 8 }
    ], { ignoreDuplicates: true });
    console.log('Products created');
    console.log('Seeding product addons...');
    const chickenProduct = await Product.findOne({ where: { name: 'Original Crispy Chicken' } });

    if (!chickenProduct) {
      throw new Error('Product "Original Crispy Chicken" not found!');
    }

    await ProductAddon.bulkCreate([
      { product_id: chickenProduct.product_id, addon_name: 'Extra Spicy Sauce', addon_price: 2000, addon_category: 'sauce' },
      { product_id: chickenProduct.product_id, addon_name: 'BBQ Sauce', addon_price: 2000, addon_category: 'sauce' },
      { product_id: chickenProduct.product_id, addon_name: 'Cheese Sauce', addon_price: 3000, addon_category: 'sauce' },
      { product_id: chickenProduct.product_id, addon_name: 'Extra Cheese', addon_price: 5000, addon_category: 'topping' },
      { product_id: chickenProduct.product_id, addon_name: 'Crispy Flakes', addon_price: 3000, addon_category: 'topping' }
    ], { ignoreDuplicates: true });

    console.log('Product addons created');
    console.log('Database seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await db.close();
    console.log('Database connection closed.');
  }
};
seedData();
