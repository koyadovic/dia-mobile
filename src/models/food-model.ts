
export interface FoodListable {
    name: string;
    manufacturer: string;
}

export interface FoodDetailable {
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

export interface FoodSelectable {
    selection; // grams or units
    g_or_ml_per_unit: number;
    mustBeSelectedInUnits(): boolean;
    getSelection(): number; // in grams or units
    setSelection(selection: number): void; // in grams or units
    weight(): number; // in grams
}

export class DiaFood implements FoodListable, FoodDetailable, FoodSelectable {
    id: number;
    favorite: boolean;

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
}

export class InternetFoodDetail implements FoodListable, FoodDetailable, FoodSelectable {
    source_name: string;
    source_id: number;

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
    g_or_ml_per_unit: number = 0;
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
