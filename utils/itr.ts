export const computeTax = (input: TaxParams): TaxComputeResult => {
    return tax_25_26(input);

}

const tax_25_26 = (input: TaxParams): TaxComputeResult => {

    const taxableIncomeOldRegime = input.income - (input.deductions?.section10 || 0) - (input.deductions?.section24 || 0) - (input.deductions?.section80C || 0) - (input.deductions?.section80CCD1B || 0) - (input.deductions?.section80CCD2 || 0) - (input.deductions?.section80D || 0) - (input.deductions?.section80DDB || 0) - (input.deductions?.section80TTA || 0) + (input?.additionalIncome || 0) - 52400;
    const taxableIncomeNewRegime = input.income - (input.deductions?.section80CCD2 || 0) + (input.additionalIncome || 0) - 75000;

    const old_Tax = taxableIncomeOldRegime > 1000000 ? (taxableIncomeOldRegime - 1000000) * 0.30 + 112500 :
        taxableIncomeOldRegime > 500000 ? (taxableIncomeOldRegime - 500000) * 0.20 + 12500 :
            taxableIncomeOldRegime > 250000 ? (taxableIncomeOldRegime - 250000) * 0.05 : 0;

    const new_Tax = taxableIncomeNewRegime > 2400000 ? (taxableIncomeNewRegime - 2400000) * 0.30 + 300000 :
        taxableIncomeNewRegime > 2000000 ? (taxableIncomeNewRegime - 2000000) * 0.25 + 200000 :
            taxableIncomeNewRegime > 1600000 ? (taxableIncomeNewRegime - 1600000) * 0.20 + 120000 :
                taxableIncomeNewRegime > 1200000 ? (taxableIncomeNewRegime - 1200000) * 0.15 + 60000 :
                    taxableIncomeNewRegime > 800000 ? (taxableIncomeNewRegime - 800000) * .10 + 20000 :
                        taxableIncomeNewRegime > 400000 ? (taxableIncomeNewRegime - 400000) * 0.05 + 0 : 0;

    const old_Rebate = taxableIncomeOldRegime > 500000 ? 0 : Math.min(old_Tax, 12500);
    const new_Rebate = taxableIncomeNewRegime > 1200000 ? 0 : Math.min(new_Tax, 60000);

    const oldSurchargeRate = taxableIncomeOldRegime > 5000000 ? 0.10 : 0;
    const old_Surcharge = taxableIncomeOldRegime > 5000000 ? (old_Tax - old_Rebate) * oldSurchargeRate : 0


    const newSurchargeRate = taxableIncomeOldRegime > 5000000 ? 0.10 : 0;
    const new_Surcharge = taxableIncomeNewRegime > 5000000 ? (new_Tax - new_Rebate) * newSurchargeRate : 0

    const old_cess = (old_Tax - old_Rebate + old_Surcharge) * 0.04;

    const new_cess = (new_Tax - new_Rebate + new_Surcharge) * 0.04;

    console.log({ taxableIncomeOldRegime, taxableIncomeNewRegime })
    console.log({ old_Rebate, new_Rebate })
    console.log({ old_Surcharge, new_Surcharge })
    console.log({ old_Tax, new_Tax })
    console.log({ old_cess, new_cess })
    const result = {
        old: {
            taxable: taxableIncomeOldRegime,
            tax: old_Tax,
            rebate: old_Rebate,
            surcharge:old_Surcharge,
            cess: old_cess,
            total: old_Tax - old_Rebate + old_Surcharge + old_cess
        },
        new: {
            taxable: taxableIncomeNewRegime,
            tax: new_Tax,
            rebate: (new_Rebate),
            surcharge:new_Surcharge,

            cess: new_cess,

            total: new_Tax - new_Rebate + new_Surcharge + new_cess

        }
    }

    return result;
}

export type TaxComputeResult = {
    old: TaxResult
    new: TaxResult
}

type TaxResult = {
    taxable: number
    tax: number

    rebate: number

    surcharge: number
    cess: number

    total: number
}

type TaxParams = {
    income: number
    deductions?: {
        section10: number
        section24: number
        section80C: number
        section80CCD1B: number
        section80DDB: number
        section80D: number
        section80TTA: number
        section80CCD2: number
    }
    additionalIncome?: number
}