'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { useEffect, useLayoutEffect, useState } from "react";
import { TaxComputeResult, computeTax } from "@/utils/itr";
import { Shim } from "./Shim";

export default function Page() {
    const [state, setState] = useState<State | null>(null);

    const [result, setResult] = useState<TaxComputeResult | null>(null);

    const intl = new Intl.NumberFormat("en-IN", { style: 'currency', currency: 'INR', })

    useLayoutEffect(() => {
        const itrJSON = global.localStorage?.getItem('itr');
        const value: State = itrJSON ? JSON.parse(itrJSON) : null;
        setState({
            gross: value?.gross || 1200000,

            section10_coupons: value?.section10_coupons || 0,
            section10_lta: value?.section10_lta || 0,
            section10_hra: value?.section10_hra || 0,
            section10_telephone: value?.section10_telephone || 0,
            section10_car: value?.section10_car || 0,
            section10_driver: value?.section10_driver || 0,
            section10_others: value?.section10_others || 0,
            section24_self: value?.section24_self || 0,
            section24_rent: value?.section24_rent || 0,
            income_savings: value?.income_savings || 0,
            income_fd: value?.income_fd || 0,
            income_other: value?.income_other || 0,
            deduction_section80c: value?.deduction_section80c || 150000,
            deduction_section80ccd1b: value?.deduction_section80ccd1b || 50000,
            deduction_section80ddb: value?.deduction_section80ddb || 0,
            deduction_section80d_self: value?.deduction_section80d_self || 25000,
            deduction_section80d_selfpreventive: value?.deduction_section80d_selfpreventive || 5000,
            deduction_section80d_parentpreventive: value?.deduction_section80d_parentpreventive || 0,
            deduction_section80d_parent: value?.deduction_section80d_parent || 0,
            deduction_section80tta: value?.deduction_section80tta || 3000,
            deduction_section80CCD2: value?.deduction_section80CCD2 || 0,

        });
    }, [])

    const section10 = (state: State) => (state.section10_coupons || 0) + (state.section10_lta || 0) + (state.section10_hra || 0) + (state.section10_telephone || 0) + (state.section10_car || 0) + (state.section10_driver || 0) + (state.section10_others || 0);
    const section24 = (state: State) => (state.section24_rent || 0) + (state.section24_self || 0);
    const section80d = (state: State) => (state.deduction_section80d_self || 0) + (state.deduction_section80d_selfpreventive || 0) + (state.deduction_section80d_parentpreventive || 0) + (state.deduction_section80d_parent || 0);
    const old_deductions = (state: State) => (state.deduction_section80c || 0) + (state.deduction_section80ccd1b || 0) + (state.deduction_section80ddb || 0) + section80d(state) + (state.deduction_section80tta || 0);
    useEffect(() => {
        if (state) {
            setResult(computeTax({
                income: state.gross,
                deductions: {
                    section10: section10(state),
                    section24: section24(state),
                    section80C: state.deduction_section80c || 0,
                    section80CCD1B: state.deduction_section80ccd1b || 0,
                    section80DDB: state.deduction_section80ddb || 0,
                    section80D: section80d(state),
                    section80TTA: state.deduction_section80tta || 0,
                    section80CCD2: state.deduction_section80CCD2 || 0
                },
                additionalIncome: (state.income_savings || 0) + (state.income_fd || 0) + (state.income_other || 0),
            }));
            if (global.localStorage) {
                global.localStorage.setItem('itr', JSON.stringify(state))
            }
        }
    }, [state])

    const shim = <Shim />;

    const isOld = result ? result?.old.total < result?.new.total : null;
    const isNew = result ? result?.new.total < result?.old.total : null;
    return (<div className="flex flex-col items-center  print:items-start">
        <section className="m-4 w-4/5 print:hidden">
            <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/itr/selector">
                <div className="mb-2 mt-4 text-lg font-medium">
                    Income Tax - Regime Selection (FY 2025 - 2026)
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                    You decide what is benefitial for you.
                </p>
                <p className="text-sm leading-7 text-muted-foreground ">
                    Disclaimer: The values shown below are aproximate and for personal use only. Please consult your tax advisor for calculations and tax liabilities. 
                </p>
            </a>
        </section>
        <section className="m-4 w-4/5 print:m-1 print:w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2/6 print:w-1/6">Head</TableHead>
                        <TableHead className="text-right w-1/6">Amount</TableHead>
                        <TableHead className="text-right  w-1/6">Old Regime</TableHead>
                        <TableHead className="text-right  w-1/6">New Regime</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Gross Salary</TableCell>
                        <TableCell className="text-right">
                            <Input defaultValue={state?.gross} onChange={(e) => state && setState({ ...state, gross: e.target.valueAsNumber })} className="text-right" type="number" placeholder="Gross Salary" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.gross) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.gross) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-medium">Section 10</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-light">Food Coupons</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.section10_coupons} onChange={(e) => state && setState({ ...state, section10_coupons: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section10_coupons) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-light">LTA Reimbursement</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="LTA Reimbursement" defaultValue={state?.section10_lta} onChange={(e) => state && setState({ ...state, section10_lta: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section10_lta) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-light">HRA</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="HRA" defaultValue={state?.section10_hra} onChange={(e) => state && setState({ ...state, section10_hra: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section10_hra) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>



                    <TableRow>
                        <TableCell className="font-light">Telephone Reimbursement</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Telephone Reimbursement" defaultValue={state?.section10_telephone} onChange={(e) => state && setState({ ...state, section10_telephone: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section10_telephone) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-light">Self-owned Car Maintenance</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Self-owned Car Maintenance" defaultValue={state?.section10_car} onChange={(e) => state && setState({ ...state, section10_car: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section10_car) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-light">Self-owned Car Driver Salary</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Self-owned Car Driver Salary" defaultValue={state?.section10_driver} onChange={(e) => state && setState({ ...state, section10_driver: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section10_driver) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-light">Any Other Exemption</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Any Other Exemption" defaultValue={state?.section10_others} onChange={(e) => state && setState({ ...state, section10_others: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section10_others) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-medium" title="Total (Section 10)">Total</TableCell>
                        <TableCell className="text-right"></TableCell>
                        <TableCell className="text-right">{state ? intl.format(section10(state)) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-medium">Section 24</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-normal">Loss from house property</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-light">Interest on Home Loan (Self Occupied)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Interest on Home Loan (Self Occupied)" defaultValue={state?.section24_self} onChange={(e) => state && setState({ ...state, section24_self: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section24_self) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-light">Interest on Home Loan (let out)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Interest on Home Loan (let out)" defaultValue={state?.section24_rent} onChange={(e) => state && setState({ ...state, section24_rent: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.section24_rent) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-medium" title="Total (Section 24)">Total</TableCell>
                        <TableCell className="text-right"></TableCell>
                        <TableCell className="text-right">{state ? intl.format(section24(state)) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>











                    <TableRow>
                        <TableCell className="font-medium">Deductions - Chapter VI A</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-normal">80C</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80c} onChange={(e) => state && setState({ ...state, deduction_section80c: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80c) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-normal">Additional Investment in NPS - 80CCD(1B)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80ccd1b} onChange={(e) => state && setState({ ...state, deduction_section80ccd1b: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80ccd1b) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>

                        
                        <TableCell className="font-normal">Medical treatment (Specified Diseases only) - Sr. Citizen - 80DDB</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80ddb} onChange={(e) => state && setState({ ...state, deduction_section80ddb: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80ccd1b) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-medium">80D</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>



                    <TableRow>
                        <TableCell className="font-light">Health Insurance Premium (Self/Spouse)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80d_self} onChange={(e) => state && setState({ ...state, deduction_section80d_self: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80d_self) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-light">Preventive Health chcekup (Self/Spouse)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80d_selfpreventive} onChange={(e) => state && setState({ ...state, deduction_section80d_selfpreventive: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80d_selfpreventive) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>



                    <TableRow>
                        <TableCell className="font-light">Preventive Health chcekup (Parents - Sr. Citizen)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80d_parentpreventive} onChange={(e) => state && setState({ ...state, deduction_section80d_parentpreventive: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80d_parentpreventive) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>



                    <TableRow>
                        <TableCell className="font-light">Medical expenditure (Parents - Sr. Citizen)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80d_parent} onChange={(e) => state && setState({ ...state, deduction_section80d_parent: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80d_parent) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-medium">Total 80D</TableCell>
                        <TableCell className="text-right"></TableCell>
                        <TableCell className="text-right">{state ? intl.format(section80d(state)) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>



                    <TableRow>
                        <TableCell className="font-normal">Interest in Savings account - 80TTA</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80tta} onChange={(e) => state && setState({ ...state, deduction_section80tta: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80tta) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>







                    <TableRow>
                        <TableCell className="font-medium">Total Deductions - Chapter VI A</TableCell>
                        <TableCell className="text-right"></TableCell>
                        <TableCell className="text-right">{state ? intl.format(old_deductions(state)) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(0) : shim}</TableCell>
                    </TableRow>










                    <TableRow>
                        <TableCell className="font-normal">Additional exemption under NPS (Employer) - 80CCD(2)</TableCell>
                        <TableCell className="text-right">
                            <Input placeholder="Food Coupons" defaultValue={state?.deduction_section80CCD2} onChange={(e) => state && setState({ ...state, deduction_section80CCD2: e.target.valueAsNumber })} className="text-right" type="number" />
                        </TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80CCD2) : shim}</TableCell>
                        <TableCell className="text-right">{state ? intl.format(state.deduction_section80CCD2) : shim}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">Tax Computation</TableCell>
                        <TableCell className="text-right"></TableCell>
                    </TableRow>




                    <TableRow>
                        <TableCell className="font-normal">Taxable Income</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className="text-right font-medium">{result ? intl.format(result?.old.taxable) : shim}</TableCell>
                        <TableCell className="text-right font-medium">{result ? intl.format(result?.new.taxable) : shim}</TableCell>
                    </TableRow>




                    <TableRow>
                        <TableCell className="font-normal">Tax</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.old.tax) : shim}</TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.new.tax) : shim}</TableCell>
                    </TableRow>




                    <TableRow>
                        <TableCell className="font-normal">Rebate</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.old.rebate) : shim}</TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.new.rebate) : shim}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-normal">Net Tax Post Rebate</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.old.tax - result?.old.rebate) : shim}</TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.new.tax - result?.new.rebate) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-normal">Surcharge</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.old.surcharge) : shim}</TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.new.surcharge) : shim}</TableCell>
                    </TableRow>


                    <TableRow>
                        <TableCell className="font-normal">Cess</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.old.cess) : shim}</TableCell>
                        <TableCell className="text-right">{result ? intl.format(result?.new.cess) : shim}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">Total Tax</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className={`text-right font-medium p-0`}><span className={` ${isOld ? " bg-gradient-to-b from-muted/50 to-muted rounded py-0.5 px-2" : ""}`}>{result ? intl.format(result?.old.total) : shim}</span></TableCell>
                        <TableCell className={`text-right font-medium p-0`}><span className={` ${isNew ? " bg-gradient-to-b from-muted/50 to-muted rounded py-0.5 px-2" : ""}`}>{result ? intl.format(result?.new.total) : shim}</span></TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="font-medium">Saving</TableCell>
                        <TableCell className="text-right">

                        </TableCell>
                        <TableCell className="text-right font-medium p-0"><span className={` ${isOld ? " bg-gradient-to-b from-muted/50 to-muted rounded py-0.5 px-2" : ""}`}>{result ? (isOld ? intl.format(result?.new.total - result?.old.total) : "") : shim}</span></TableCell>
                        <TableCell className="text-right font-medium p-0"><span className={` ${isNew ? " bg-gradient-to-b from-muted/50 to-muted rounded py-0.5 px-2" : ""}`}>{result ? (isNew ? intl.format(result?.old.total - result?.new.total) : "") : shim}</span></TableCell>
                    </TableRow>


                </TableBody>
            </Table>

            <div>

            </div>
        </section>
    </div>
    );
}

type State = {
    gross: number

    section10_coupons: number
    section10_lta: number
    section10_hra: number
    section10_telephone: number
    section10_car: number
    section10_driver: number
    section10_others: number

    section24_self: number
    section24_rent: number

    income_savings: number
    income_fd: number
    income_other: number


    deduction_section80c: number
    deduction_section80ccd1b: number
    deduction_section80ddb: number
    deduction_section80d_self: number
    deduction_section80d_selfpreventive: number
    deduction_section80d_parentpreventive: number
    deduction_section80d_parent: number
    deduction_section80tta: number
    deduction_section80CCD2: number


}

