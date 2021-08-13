const db = require('../data/db-configs')

const getRecipeById = async id => {
    // select 
    //  r.*, 
    //  s.step_id, 
    //  s.step_number, 
    //  s.step_instructions, 
    //  i.ingredient_id, 
    //  i.ingredient_name, 
    //  si.ingredient_quantity
    // from recipes as r
    // join steps as s
    //  on s.recipe_id = r.recipe_id
    // join steps_ingredients as si
    //  on si.step_id = s.step_id
    // left join ingredients as i
    //  on i.ingredient_id = si.ingredient_id
    // where r.recipe_id = 2;
 
const unstructuredRecipe = await db
    .select(
        'r.*', 
        's.step_id', 
        's.step_number', 
        's.step_instructions',
        'i.ingredient_id',
        'i.ingredient_name',
        'si.ingredient_quantity')
    .from('recipes as r')
    .join('steps as s', 's.recipe_id', 'r.recipe_id')
    .join('steps_ingredients as si', 'si.step_id', 's.step_id')
    .leftJoin('ingredients as i', 'i.ingredient_id', 'si.ingredient_id')
    .where('r.recipe_id', id)
    .orderBy('s.step_number')

const ingredients = unstructuredRecipe.map(item => { 
    if(!item["ingredient_id"]){
        return []
    } else {
        return {
            "step_id": item["step_id"],
            "ingredient_id": item["ingredient_id"],
            "ingredient_name": item["ingredient_name"],
            "quantity": item["ingredient_quantity"]
        }
    }
})

const steps = unstructuredRecipe.map(item => {
    const stepId = item["step_id"]
    return {
        "step_id": item["step_id"],
        "step_number": item["step_number"],
        "step_instructions": item["step_instructions"],
        "ingredients": ingredients.filter((ingredient) => {
            return ingredient["step_id"] === stepId
        })
    }
})

const filteredSteps = steps.filter((step, index, steps) => 
    index === steps.findIndex((s) => (
        s.step_id === step.step_id
    )))

const recipe = {
    "recipe_id": unstructuredRecipe[0]["recipe_id"],
    "recipe_name": unstructuredRecipe[0]["recipe_name"],
    "created_at": unstructuredRecipe[0]["created_at"],
    "steps": filteredSteps
}

return recipe
}

module.exports = {
    getRecipeById
}