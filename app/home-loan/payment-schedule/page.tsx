"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { calculateAmortization, getMapValue } from "./calculateAmortization";
import { Schedule } from "./Schedule";
import { getSummaryRows } from "./getSummaryRows";

const intl = new Intl.NumberFormat("en-IN", { style: 'currency', currency: 'INR', })

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [interestRateOD, setInterestRateOD] = useState<number>(0);


  const [inputsPrepayment, setInputsPrepayment] = useState<Map<number, number>>(new Map<number, number>());
  const [inputsAdditionalEMI, setInputsAdditionalEMI] = useState<Map<number, number>>(new Map<number, number>());
  const [inputsInterestRate, setInputsInterestRate] = useState<Map<number, number>>(new Map<number, number>());





  const handleInputChange = useCallback((type: 'Prepayment' | 'AdditionalEMI' | 'InterestRate', index: number, value: number) => {
    if (type === "Prepayment") {
      setInputsPrepayment(new Map<number, number>(inputsPrepayment.set(index, value)));

    }



    if (type === "AdditionalEMI") {
      setInputsAdditionalEMI(new Map<number, number>(inputsAdditionalEMI.set(index, value)));
    }

    if (type === "InterestRate") {
      setInputsInterestRate(new Map<number, number>(inputsInterestRate.set(index, value)));

    }


  }, []);

  useLayoutEffect(() => {
    const itrJSON = global.localStorage?.getItem('portfolio');
    const value = itrJSON ? JSON.parse(itrJSON) : null;


    setLoanAmount(value?.loanAmount || 200000);
    setTenure(value?.tenure || 24);
    setInterestRate(value?.interestRate || 8);
    setInterestRateOD(value?.interestRateOD || 8);

    if (value) {
      if (value.inputsPrepayment) setInputsPrepayment(new Map<number, number>(value.inputsPrepayment));
      if (value.additionalEMIs) setInputsAdditionalEMI(new Map<number, number>(value.additionalEMIs));
      if (value.inputsAdditionalEMI) setInputsInterestRate(new Map<number, number>(value.inputsAdditionalEMI));
    }
  }, [])




  useEffect(() => {


    if (global.localStorage) {
      global.localStorage.setItem('portfolio', JSON.stringify({
        loanAmount, tenure, interestRate, interestRateOD,
        inputsPrepayment: [...inputsPrepayment.entries()],
        inputsAdditionalEMI: [...inputsAdditionalEMI.entries()],
        inputsInterestRate: [...inputsInterestRate.entries()],

      }))
    }

  }, [loanAmount, tenure, interestRate, interestRateOD, inputsPrepayment, inputsAdditionalEMI, inputsInterestRate]);


  const schedules = useMemo(() => calculateAmortization(loanAmount, tenure, interestRate, interestRateOD, inputsPrepayment, inputsPrepayment, inputsAdditionalEMI, inputsInterestRate, inputsInterestRate), [
    loanAmount, tenure, interestRate, interestRateOD, inputsPrepayment, inputsAdditionalEMI, inputsInterestRate
  ]);

  return (<div className="flex flex-col items-center  print:items-start">
    <section className="m-4 w-4/5 print:hidden">
      <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
        href="/itr/selector">
        <div className="mb-2 mt-4 text-lg font-medium">
          Mutual Fund - Portfolio
        </div>
        <p className="text-sm leading-tight text-muted-foreground">
          Build your fund portfolio
        </p>
        <p className="text-sm leading-7 text-muted-foreground ">
          Disclaimer: The values shown below are aproximate and for personal use only. Please consult your mutual fund advisor/AMC for accurate calculations.
        </p>
      </a>
    </section>
    <div className="flex flex-col gap-2 gap-y-4 w-4/5 print:w-full">
      <div className="">

        <Table >
          <TableHeader>
            <TableRow>
              <TableHead className="text-right w/1/4">Loan Amount</TableHead>
              <TableHead className="text-right w/1/4">Tenure</TableHead>
              <TableHead className="text-right w/1/4">Rate</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-right">
                <Input className="text-right " type="number" placeholder="Loan Amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.valueAsNumber)} />
              </TableCell>
              <TableCell>
                <Input className="text-right " type="number" placeholder="Tenure (months)" value={tenure} onChange={(e) => setTenure(e.target.valueAsNumber)} />
              </TableCell>
              <TableCell>
                <Input className="text-right " type="number" placeholder="Interest Rate (%)" value={interestRate} onChange={(e) => setInterestRate(e.target.valueAsNumber)} />
              </TableCell>
              
            </TableRow>
           
          </TableBody>
        </Table>

      </div>

      <Label className="font-semibold mb-2">Summary</Label>

      <Summary schedules={schedules} />


      <section className="flex flex-col gap-2 ">
        <Label className="font-semibold mb-2">Amortization Table</Label>

    

        <Table className="border-collapse border">
          <AmortizationTableHeader />
          <TableBody>
            {schedules.filter(a=>!!a.prepayment).map((schedule, idx) => {
              const rate = getMapValue(inputsInterestRate, idx, interestRate);
              const additionalEMI = getMapValue(inputsAdditionalEMI, idx, 0);

              const prepayInput = inputsPrepayment.get(idx) || 0;
              return <AmortizationTableRow key={idx} {...{ idx, rate, additionalEMI, prepayInput, schedule }} handleInputChange={handleInputChange} />
            }
            )}
          </TableBody>
        </Table>
      </section>


    </div>
  </div>
  );
}


const Summary = ({ schedules }: { schedules: Schedule[] }) => {
  return <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Variation</TableHead>
        <TableHead>Total Payments</TableHead>
        <TableHead>Total Interest</TableHead>
        <TableHead>Tenure (Months)</TableHead>
        <TableHead>Interest Saved</TableHead>
        <TableHead>Tenure Saved</TableHead>
        <TableHead>Cheaper Than EMI?</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {getSummaryRows(schedules).filter((a,i)=> i<=1).map((row, idx) => (
        <TableRow key={idx}>
          <TableCell>{row.variation}</TableCell>
          <TableCell>{intl.format(row.totalPayments)}</TableCell>
          <TableCell>{intl.format(row.totalInterest)}</TableCell>
          <TableCell>{row.tenureMonths}</TableCell>
          <TableCell>{intl.format(row.interestSaved)}</TableCell>
          <TableCell>{row.tenureSaved}</TableCell>
          <TableCell>{row.cheaperThanEMI}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
}


type AmortizationTableRowProps = {
  idx: number
  schedule: Schedule
  rate: number
  prepayInput: number
  additionalEMI: number



  handleInputChange: (type: 'Prepayment' | 'AdditionalEMI' | 'InterestRate' , index: number, value: number) => void
}
const AmortizationTableHeader = () => {
  return <TableHeader>
    <TableRow className="border h-12" >
      <TableHead className="border" >Month</TableHead>
      <TableHead className="text-right border" >EMI</TableHead>
      <TableHead className="text-right border w-24" ><span>Additional </span><br /><span>EMI</span></TableHead>
      <TableHead className="text-right border w-8">Rate</TableHead>
     
      

      {/* <TableHead className="text-right border">Opening Balance Principal</TableHead> */}
      <TableHead className="text-right border">Payment</TableHead>
      <TableHead className="text-right border w-22"><span>Prepayment </span><br /><span>Amount</span></TableHead>
      <TableHead className="text-right border"><span>Balance</span><br /><span>Principal</span></TableHead>
      <TableHead className="text-right border "><span>Cumulative </span><br /><span>Pre-Payment</span></TableHead>
      <TableHead className="text-right border wrap-break-word"><span>Interest </span><br /><span>Component</span></TableHead>
      <TableHead className="text-right border"><span>Principal </span><br /><span>Component</span></TableHead>
      <TableHead className="text-right border"><span>Loan </span><br /><span>Balance</span></TableHead>

     
    </TableRow>
  </TableHeader>
}
const AmortizationTableRow = memo(({ idx, rate, additionalEMI, prepayInput, schedule, handleInputChange }: AmortizationTableRowProps) => {
  console.log('row' + idx);
  const normal = schedule.original;
  const prepay = schedule.prepayment;




  return <TableRow key={idx}>
    <TableCell className="border text-center">{normal?.month}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.emi) : null}</TableCell>

    <TableCell className="border" >
      <Input type="number" className="text-right  min-w-24" min={0} value={additionalEMI} onChange={(e) => handleInputChange('AdditionalEMI', idx, e.target.valueAsNumber)} />
    </TableCell>
    <TableCell >
      <Input type="number" className="text-right  min-w-18" min={0} value={rate} onChange={(e) => handleInputChange('InterestRate', idx, e.target.valueAsNumber)} />
    </TableCell>




    {/* <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.openingBalance) : null}</TableCell> */}
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.payment) : null}</TableCell>
    <TableCell className="">
      {!!prepay && <Input type="number" min={0} max={prepay.openingBalance} className={`text-right min-w-22 invalid:text-red-500`} value={prepayInput} onChange={(e) => handleInputChange('Prepayment', idx, e.target.valueAsNumber)} />}
    </TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.effectiveBalance) : null}</TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.cumulative) : null}</TableCell>

    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.interest) : null}</TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.principal) : null}</TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.balance) : null}</TableCell>



   

   


  </TableRow>
});