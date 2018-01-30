export enum PLANNING_TYPES {
    PHYSICAL_ACTIVITY = 'physical_activity',
    //PHYSICAL_TRAIT_CHANGE = 'physical_trait',
    //FEEDING = 'feeding',
    //GLUCOSE = 'glucose',
    INSULIN_DOSE = 'insulin_dose',
}

export interface Planning {
    id: number | null;
    name: string;

    type: PLANNING_TYPES;
    data: object;

    enabled: boolean;

    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean; 
    sun: boolean;


    local_hour: number;
    local_minute: number;
}