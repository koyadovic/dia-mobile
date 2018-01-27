
export interface FoodListable {
    name: string;
    manufacturer: string;

    clone();
}

export interface FoodDetailable extends FoodListable {
    g_or_ml: number;
    carb_g: number;
    protein_g: number;
    fat_g: number;
    fiber_g: number;
    alcohol_g: number;
    carb_factor: number;
    protein_factor: number;
    fat_factor: number;
    fiber_factor: number;
    alcohol_factor: number;
}

export interface FoodSelectable extends FoodDetailable {
    selection; // grams or units
    g_or_ml_per_unit: number;
    mustBeSelectedInUnits(): boolean;
    getSelection(): number; // in grams or units
    setSelection(selection: number): void; // in grams or units
    weight(): number; // in grams
}

export class Food implements FoodDetailable {
    // Interface
    name: string;
    manufacturer: string;
    g_or_ml: number;
    carb_g: number;
    protein_g: number;
    fat_g: number;
    fiber_g: number;
    alcohol_g: number;
    carb_factor: number;
    protein_factor: number;
    fat_factor: number;
    fiber_factor: number;
    alcohol_factor: number;

    selection;
    g_or_ml_per_unit: number;

    constructor(jsonObj) {
        this.name = jsonObj.name;
        this.manufacturer = jsonObj.manufacturer;
        this.g_or_ml = jsonObj.g_or_ml;
        this.carb_g = jsonObj.carb_g;
        this.protein_g = jsonObj.protein_g;
        this.fat_g = jsonObj.fat_g;
        this.fiber_g = jsonObj.fiber_g;
        this.alcohol_g = jsonObj.alcohol_g;
        this.carb_factor = jsonObj.carb_factor;
        this.protein_factor = jsonObj.protein_factor;
        this.fat_factor = jsonObj.fat_factor;
        this.fiber_factor = jsonObj.fiber_factor;
        this.alcohol_factor = jsonObj.alcohol_factor;
        this.selection = 0;
        this.g_or_ml_per_unit = jsonObj.g_or_ml_per_unit
    }

    kcal(){
        return (+this.carb_g * 4.) + (this.protein_g * 4.) + (this.fat_g * 9.) + (this.alcohol_g * 7.);
    }
}

export class DiaFood extends Food implements FoodSelectable {
    id: number;
    favorite: boolean;

    constructor(jsonObj) {
        super(jsonObj);
        this.id = jsonObj.id;
        this.favorite = jsonObj.favorite;
    }

    mustBeSelectedInUnits() {
        return this.g_or_ml_per_unit > 0;
    }
    getSelection() {
        return this.selection;
    }
    setSelection(selection: number) {
        this.selection = selection;
    }
    weight() {
        if(this.mustBeSelectedInUnits())
            return this.selection * this.g_or_ml_per_unit;
        return this.selection;
    }

}

export class InternetFoodList implements FoodListable {
    source_name: string;
    source_id: number;

    // Interface
    name: string;
    manufacturer: string;

    constructor(jsonObj) {
        this.name = jsonObj.name;
        this.manufacturer = jsonObj.manufacturer;
        this.source_name = jsonObj.source_name;
        this.source_id = jsonObj.source_id;
    }
}

export class InternetFoodDetail extends Food implements FoodSelectable  {
    source_name: string;
    source_id: number;

    constructor(jsonObj) {
        super(jsonObj);
        this.source_name = jsonObj.source_name;
        this.source_id = jsonObj.source_id;
    }

    mustBeSelectedInUnits() {
        return false;
    }

    getSelection() {
        return this.selection;
    }
    setSelection(selection: number) {
        this.selection = selection;
    }
    weight() {
        return this.selection;
    }
}
