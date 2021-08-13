const express = require('express')
const Recipes = require('./recipes-model')

const router = express.Router()

router.get('/:id', async (req, res, next) => {
    try{
        const { id } = req.params
        const recipe = await Recipes.getRecipeById(id)
        res.status(200).json(recipe)
    } catch(err) {
        next(err)
    }
})

module.exports = router