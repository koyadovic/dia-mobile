export enum ADMINISTRATION_TYPES {
    TOPICAL = 'topical',
    ORAL = 'oral',
    INJECTED = 'injected'
}

export interface Medication {
    id: number;
    name: string;

    administration_type: ADMINISTRATION_TYPES;
    type: string;
    sub_type: string;
}