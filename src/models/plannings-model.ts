export enum PLANNING_TYPES {
    PHYSICAL_ACTIVITY = 'physical_activity',
    PHYSICAL_TRAIT_CHANGE = 'physical_trait',
    FEEDING = 'feeding',
    GLUCOSE = 'glucose',
    INSULIN_DOSE = 'insulin_dose',
}

export interface Planning {
    type: PLANNING_TYPES;
    id: number | null;
    enabled: boolean;

    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;

    data: object;

    local_hour: number;
    local_minute: number;
}