import Category from "../models/Category";


export const getAllCategory = async (req,res) => {
    try {
        const response = await Category.findAll();
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getCategoryById = async (req,res) => {
    try {
        const response = await Category.findOne({
            where:{
                category_id: req.params.category_id
            }
        })

        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}


export const createCategory = async (req,res) => {
    try {
        await Category.create(req.body);
        res.status(201).json({msg:'Congratss, Category succesfully created !!'})
    } catch (error) {
        console.log(error.message)
    }
}

export const updateCategory = async (req,res) => {
    try {
        await Category.update(req.body, {
            where:{
                category_id: req.params.category_id
            }
        })
        res.status(200).json({msg:'Yoshh, Category has been updated !'})
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteCategory = async (req, res) => {
    try {
        await Category.destroy({
            where:{
                category_id: req.params.category_id
            }
        })
        res.status(200).json({msg:'Oh Noo, the category has been left you'})
    } catch (error) {
        
    }
}