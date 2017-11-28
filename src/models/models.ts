


class GlucoseLevel {
    id: number;
    user: number;
    instant: string;

    level: number;
}


class PhysicalActivity {
    id: number;
    user: number;
    instant: string;

    intensity: number;
    minutes: number;
}


class PhysicalTrait {
    id: number;
    user: number;
    instant: string;

    trait_type: number;
    value: number;
}


class Feeding {
    id: number;
    user: number;
    instant: string;

    total_gr_ml: number;
    carb_gr: number;
    protein_gr: number;
    fat_gr: number;
    fiber_gr: number;
    alcohol_gr: number;
}


class InsulinDose {
    id: number;
    user: number;
    instant: string;

    insulin_type: number;
    dose: number;
}
