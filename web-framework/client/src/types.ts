// src/types.ts
export interface School {
    id: number;
    DistrictName: string;
    Name: string;
    AUN: string;
    Schl: string;
    DataElement: string;
    DisplayValue: number;
}

export interface GraduationData {
    district_name: string;
    county: string;
    four_year_grads: number;
    four_year_cohort: number;
    four_year_white_rate: number;
    four_year_black_rate: number;
    four_year_hispanic_rate: number;
    four_year_econ_disadvantaged_rate: number;
    five_year_grads: number;
    five_year_cohort: number;
    six_year_grads: number;
    six_year_cohort: number;
}