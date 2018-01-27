
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
}

export interface FoodSelectable extends FoodDetailable {
    carb_g: number;
    protein_g: number;
    fat_g: number;
    fiber_g: number;
    alcohol_g: number;
    selection; // grams or units
    g_or_ml_per_unit: number; // if > 0 selection is units, else g_or_ml
}


/***********************/
/* Concrete interfaces */
/***********************/


export interface DiaFood extends FoodListable, FoodSelectable {
    id: number;
    favorite: boolean;
}

export interface InternetFoodList extends FoodListable {
    source_name: string;
    source_id: number;
}


export interface InternetFoodDetail extends InternetFoodList, FoodSelectable {
}


/********************/
/* Useful functions */
/********************/


export function weight(food: FoodSelectable) {
    if (food.g_or_ml_per_unit > 0) {
        return food.selection * food.g_or_ml_per_unit;
    } else {
        return food.selection;
    }
}

export function selection_kcal(food: FoodSelectable) {
    let w = weight(food);
    return (food.carb_factor * w * 4.) + (food.protein_factor * w * 4.) + (food.fat_factor * w * 9.) + (food.alcohol_factor * w * 7.);
}

