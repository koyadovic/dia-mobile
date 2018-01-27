
export interface FoodListable {
    name: string;
    manufacturer: string;
}

export interface FoodDetailable {
    carb_factor: number;
    protein_factor: number;
    fat_factor: number;
    fiber_factor: number;
    alcohol_factor: number;
    g_or_ml_per_unit: number; // if > 0 selection is units, else g_or_ml
}

export interface FoodSelected {
    food: FoodDetailable;
    carb_g: number;
    protein_g: number;
    fat_g: number;
    fiber_g: number;
    alcohol_g: number;
    selection; // grams or units
}


/***********************/
/* Concrete interfaces */
/***********************/


export interface DiaFood extends FoodListable, FoodDetailable {
    id: number;
    favorite: boolean;
}

export interface InternetFoodList extends FoodDetailable {
    source_name: string;
    source_id: number;
}

export interface InternetFoodDetail extends InternetFoodList, FoodDetailable {
}


/********************/
/* Useful functions */
/********************/


export function weight(food_selected: FoodSelected) {
    if (food_selected.food.g_or_ml_per_unit > 0) {
        return food_selected.selection * food_selected.food.g_or_ml_per_unit;
    } else {
        return food_selected.selection;
    }
}

export function selection_kcal(food_selected: FoodSelected) {
    let w = weight(food_selected);
    return (food_selected.food.carb_factor * w * 4.) + (food_selected.food.protein_factor * w * 4.) + (food_selected.food.fat_factor * w * 9.) + (food_selected.food.alcohol_factor * w * 7.);
}

