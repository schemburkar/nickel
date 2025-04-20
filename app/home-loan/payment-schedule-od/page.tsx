"use client";

import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { calculateAmortization, getMapValue } from "../payment-schedule/calculateAmortization";
import { Schedule, ScheduleItem } from "../payment-schedule/Schedule";
import { getSummaryRows } from "../payment-schedule/getSummaryRows";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const intl = new Intl.NumberFormat("en-IN", { style: 'currency', currency: 'INR', })

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [tenure, setTenure] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [interestRateOD, setInterestRateOD] = useState<number>(0);


  const [inputsPrepayment, setInputsPrepayment] = useState<Map<number, number>>(new Map<number, number>());
  const [inputsOD, setInputsOD] = useState<Map<number, number>>(new Map<number, number>());
  const [inputsAdditionalEMI, setInputsAdditionalEMI] = useState<Map<number, number>>(new Map<number, number>());
  const [inputsInterestRate, setInputsInterestRate] = useState<Map<number, number>>(new Map<number, number>());
  const [inputsInterestRateOD, setInputsInterestRateOD] = useState<Map<number, number>>(new Map<number, number>());

  const [useDifferentInterestRateOD, setUseDifferentInterestRateOD] = useState(true);
  const [useSharedInputPrepaymentOD, setUseSharedInputPrepaymentOD] = useState(true);




  const handleInputChange = useCallback((type: 'Prepayment' | 'OD' | 'AdditionalEMI' | 'InterestRate' | 'InterestRateOD', index: number, value: number) => {
    if (type === "Prepayment") {
      setInputsPrepayment(new Map<number, number>(inputsPrepayment.set(index, value)));
      if (useSharedInputPrepaymentOD) {
        setInputsOD(new Map<number, number>(inputsOD.set(index, value)));
      }
    }

    if (type === "OD") {
      setInputsOD(new Map<number, number>(inputsOD.set(index, value)));
      if (useSharedInputPrepaymentOD) {
        setInputsPrepayment(new Map<number, number>(inputsPrepayment.set(index, value)));
      }
    }

    if (type === "AdditionalEMI") {
      setInputsAdditionalEMI(new Map<number, number>(inputsAdditionalEMI.set(index, value)));
    }

    if (type === "InterestRate") {
      setInputsInterestRate(new Map<number, number>(inputsInterestRate.set(index, value)));
      if (!useDifferentInterestRateOD) {
        setInputsInterestRateOD(new Map<number, number>(inputsInterestRateOD.set(index, value)));
      }
    }

    if (type === "InterestRateOD") {
      setInputsInterestRateOD(new Map<number, number>(inputsInterestRateOD.set(index, value)));
    }
  }, []);

  useLayoutEffect(() => {
    const itrJSON = global.localStorage?.getItem('portfolio-od');
    const value = itrJSON ? JSON.parse(itrJSON) : null;


    setLoanAmount(value?.loanAmount || 200000);
    setTenure(value?.tenure || 24);
    setInterestRate(value?.interestRate || 8);
    setInterestRateOD(value?.interestRateOD || 8);

    if (value) {
      if (value.inputsPrepayment) setInputsPrepayment(new Map<number, number>(value.inputsPrepayment));
      if (value.inputsOD) setInputsOD(new Map<number, number>(value.inputsOD));
      if (value.additionalEMIs) setInputsAdditionalEMI(new Map<number, number>(value.additionalEMIs));
      if (value.inputsAdditionalEMI) setInputsInterestRate(new Map<number, number>(value.inputsAdditionalEMI));
      if (value.inputsInterestRateOD) setInputsInterestRateOD(new Map<number, number>(value.inputsInterestRateOD));


      setUseDifferentInterestRateOD(value.useDifferentInterestRateOD);
      setUseSharedInputPrepaymentOD(value.useSharedInputPrepaymentOD);

    }
  }, [])




  useEffect(() => {


    if (global.localStorage) {
      global.localStorage.setItem('portfolio-od', JSON.stringify({
        loanAmount, tenure, interestRate, interestRateOD,
        inputsPrepayment: [...inputsPrepayment.entries()],
        inputsOD: [...inputsOD.entries()],
        inputsAdditionalEMI: [...inputsAdditionalEMI.entries()],
        inputsInterestRate: [...inputsInterestRate.entries()],
        inputsInterestRateOD: [...inputsInterestRateOD.entries()],
        useDifferentInterestRateOD,
        useSharedInputPrepaymentOD
      }))
    }

  }, [loanAmount, tenure, interestRate, interestRateOD, inputsPrepayment, inputsOD, inputsAdditionalEMI, inputsInterestRate, inputsInterestRateOD, useDifferentInterestRateOD, useSharedInputPrepaymentOD]);


  const schedules = useMemo(() => calculateAmortization(loanAmount, tenure, interestRate, interestRateOD, inputsPrepayment, inputsOD, inputsAdditionalEMI, inputsInterestRate, inputsInterestRateOD), [
    loanAmount, tenure, interestRate, interestRateOD, inputsPrepayment, inputsOD, inputsAdditionalEMI, inputsInterestRate, inputsInterestRateOD
  ]);

  return (<div className="flex flex-col  items-center  print:items-start">
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
    <div className="flex flex-col gap-2 gap-y-4 w-4/5 print:w-full ">
      <div >

        <Table >
          <TableHeader>
            <TableRow>
              <TableHead className="text-right w/1/4">Loan Amount</TableHead>
              <TableHead className="text-right w/1/4">Tenure</TableHead>
              <TableHead className="text-right w/1/4">Rate</TableHead>
              <TableHead className="text-right w/1/4">{useDifferentInterestRateOD ? "OD Rate" : ""}</TableHead>

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
                <Input className="text-right " type="number" placeholder="Interest Rate (%)" value={interestRate}
                  onChange={(e) => {
                    setInterestRate(e.target.valueAsNumber);
                    if (!useDifferentInterestRateOD) setInterestRateOD(e.target.valueAsNumber);
                  }} />
              </TableCell>
              <TableCell>
                {useDifferentInterestRateOD && <Input className="text-right" type="number" placeholder="OD Interest Rate (%)" value={interestRateOD} onChange={(e) => setInterestRateOD(e.target.valueAsNumber)} />}
              </TableCell>
            </TableRow>
            <TableRow>
              
              <TableCell colSpan={4} className="whitespace-normal">
                <div className="flex items-center gap-2  ">
                  <Switch className="" checked={useDifferentInterestRateOD} onCheckedChange={() => setUseDifferentInterestRateOD(!useDifferentInterestRateOD)} />
                  <Label>Use different Interest Rate for both prepayment and OD</Label>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

      </div>

      <Label className="font-semibold mb-2">Summary</Label>

      <Summary schedules={schedules} />


      <section className="flex flex-col gap-2 ">
        <Label className="font-semibold mb-2">Amortization Table (Combined)</Label>


        <Tabs defaultValue="original" className="">
          <div className="flex not-lg:flex-col justify-stretch">

            <TabsList>
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="prepayment">Prepayment</TabsTrigger>
              <TabsTrigger value="od">OD</TabsTrigger>
            </TabsList>
              <div className="flex items-center gap-2 self-end h-9 w-full justify-end">
                <Switch checked={useSharedInputPrepaymentOD} onCheckedChange={() => setUseSharedInputPrepaymentOD(!useSharedInputPrepaymentOD)} />
                <Label>Sync monthly input for both prepayment and OD</Label>
              </div>
          </div>
          <TabsContent value="original">
            <Table className="border-collapse border not-sm:w-fit">
              <AmortizationTableOriginalHeader />
              <TableBody>
                {schedules.map((schedule, idx) => {
                  const rate = getMapValue(inputsInterestRate, idx, interestRate);
                  const rateOD = getMapValue(inputsInterestRateOD, idx, interestRateOD);
                  const additionalEMI = getMapValue(inputsAdditionalEMI, idx, 0);

                  const prepayInput = inputsPrepayment.get(idx) || 0;
                  const odInput = inputsOD.get(idx) || 0;
                  if (schedule.original)
                    return <AmortizationTableOriginalRow {...{ idx, rate, rateOD, additionalEMI, prepayInput, odInput, schedule }} handleInputChange={handleInputChange} />
                }
                )}
              </TableBody>
            </Table>

          </TabsContent>
          <TabsContent value="prepayment">
            <Table className="border-collapse border">
              <AmortizationTablePrepaymentHeader />
              <TableBody>
                {schedules.map((schedule, idx) => {
                  const rate = getMapValue(inputsInterestRate, idx, interestRate);
                  const rateOD = getMapValue(inputsInterestRateOD, idx, interestRateOD);
                  const additionalEMI = getMapValue(inputsAdditionalEMI, idx, 0);

                  const prepayInput = inputsPrepayment.get(idx) || 0;
                  const odInput = inputsOD.get(idx) || 0;
                  if (schedule.prepayment)
                    return <AmortizationTablePrepaymentRow {...{ idx, rate, rateOD, additionalEMI, prepayInput, odInput, schedule }} handleInputChange={handleInputChange} />
                }
                )}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="od">
            <Table className="border-collapse border">
              <AmortizationTableODHeader />
              <TableBody>
                {schedules.map((schedule, idx) => {
                  const rate = getMapValue(inputsInterestRate, idx, interestRate);
                  const rateOD = getMapValue(inputsInterestRateOD, idx, interestRateOD);
                  const additionalEMI = getMapValue(inputsAdditionalEMI, idx, 0);

                  const prepayInput = inputsPrepayment.get(idx) || 0;
                  const odInput = inputsOD.get(idx) || 0;
                  if (schedule.od)
                    return <AmortizationTableODRow {...{ idx, rate, rateOD, additionalEMI, prepayInput, odInput, schedule }} handleInputChange={handleInputChange} />
                }
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

      </section>


    </div>
  </div >
  );
}



const Summary = ({ schedules }: { schedules: Schedule[] }) => {
  return <Table className="not-lg:w-full print:w-fit ">
    <TableHeader>
      <TableRow>
        <TableHead className="whitespace-normal">Variation</TableHead>
        <TableHead className="whitespace-normal">Total Payments</TableHead>
        <TableHead className="whitespace-normal">Payments vs Prepayment</TableHead>
        <TableHead className="whitespace-normal">Total Interest</TableHead>
        <TableHead className="whitespace-normal">Tenure (Months)</TableHead>
        <TableHead className="whitespace-normal">Interest Saved</TableHead>
        <TableHead className="whitespace-normal">Interest Saved vs Prepayment</TableHead>
        <TableHead className="whitespace-normal">Tenure Saved</TableHead>
        <TableHead className="whitespace-normal">Cheaper Than EMI?</TableHead>
        <TableHead className="whitespace-normal">Cheaper Than Prepayment?</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {getSummaryRows(schedules).map((row, idx) => (
        <TableRow key={idx}>
          <TableCell>{row.variation}</TableCell>
          <TableCell>{intl.format(row.totalPayments)}</TableCell>
          <TableCell>{!!row.totalPaymentsWithPrepayment && intl.format(row.totalPaymentsWithPrepayment)}</TableCell>
          <TableCell>{intl.format(row.totalInterest)}</TableCell>
          <TableCell>{row.tenureMonths}</TableCell>
          <TableCell>{intl.format(row.interestSaved)}</TableCell>
          <TableCell>{!!row.interestSavedWithPrepayment && intl.format(row.interestSavedWithPrepayment)}</TableCell>
          <TableCell>{row.tenureSaved}</TableCell>
          <TableCell>{row.cheaperThanEMI}</TableCell>
          <TableCell>{row.cheaperThanPrepayment}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
}


type AmortizationTableRowProps = {
  idx: number
  schedule: Schedule
  rate: number
  rateOD: number
  prepayInput: number
  odInput: number
  additionalEMI: number




  handleInputChange: (type: 'Prepayment' | 'OD' | 'AdditionalEMI' | 'InterestRate' | 'InterestRateOD', index: number, value: number) => void
}

const AmortizationTableOriginalHeader = () => {
  return <TableHeader>
    <TableRow className="border h-12" >
      <TableHead className="border" >Month</TableHead>
      <TableHead className="text-right border" >EMI</TableHead>
      <TableHead className="text-right border w-24" ><span>Additional </span><br /><span>EMI</span></TableHead>
      <TableHead className="text-right border w-8">Rate</TableHead>



      {/* <TableHead className="text-right border">Opening Balance Principal</TableHead> */}
      <TableHead className="text-right border">Payment</TableHead>
      <TableHead className="text-right border"><span>Balance</span><br /><span>Principal</span></TableHead>
      <TableHead className="text-right border wrap-break-word"><span>Interest </span><br /><span>Component</span></TableHead>
      <TableHead className="text-right border"><span>Principal </span><br /><span>Component</span></TableHead>
      <TableHead className="text-right border"><span>Loan </span><br /><span>Balance</span></TableHead>


    </TableRow>
  </TableHeader>
}

const AmortizationTablePrepaymentHeader = () => {
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

const AmortizationTableODHeader = () => {
  return <TableHeader>
    <TableRow className="border h-12" >
      <TableHead className="border" >Month</TableHead>
      <TableHead className="text-right border" >EMI</TableHead>
      <TableHead className="text-right border w-24" ><span>Additional </span><br /><span>EMI</span></TableHead>
      <TableHead className="text-right border w-8">Rate</TableHead>



      {/* <TableHead className="text-right border">Opening Balance Principal</TableHead> */}
      <TableHead className="text-right border">Payment</TableHead>
      <TableHead className="text-right border w-22"><span>Deposit </span><br /><span>Amount</span></TableHead>
      {/* <TableHead className="text-right border"><span>Balance</span><br /><span>Principal</span></TableHead> */}
      <TableHead className="text-right border "><span>Cumulative </span><br /><span>Payment</span></TableHead>
      <TableHead className="text-right border wrap-break-word"><span>Interest </span><br /><span>Component</span></TableHead>
      <TableHead className="text-right border"><span>Principal </span><br /><span>Component</span></TableHead>
      <TableHead className="text-right border"><span>Loan </span><br /><span>Balance</span></TableHead>
      <TableHead className="text-right border"><span>Effective </span><br /><span>Balance</span></TableHead>


    </TableRow>
  </TableHeader>
}

const AmortizationTableHeader1 = () => {
  return <TableHeader>
    <TableRow className="border h-12" >
      <TableHead className="border" rowSpan={2}>Month</TableHead>
      <TableHead className="text-right" rowSpan={2}>EMI</TableHead>
      <TableHead className="text-right border" rowSpan={2}>Additional EMI</TableHead>
      <TableHead className="text-right border" rowSpan={2}>Rate</TableHead>
      <TableHead className="text-center border border-r-4" colSpan={4}>Original</TableHead>
      <TableHead className="text-center border border-r-4" colSpan={6}>Prepayment</TableHead>
      <TableHead className="text-center border" colSpan={7}>OD</TableHead>
    </TableRow>
    <TableRow className="border  h-16" >
      <TableHead className="text-right border">Payment</TableHead>
      <TableHead className="text-right border">Interest</TableHead>
      <TableHead className="text-right border">Principal</TableHead>
      <TableHead className="text-right border border-r-4">Balance</TableHead>

      <TableHead className="text-right border">Payment</TableHead>
      <TableHead className="text-right border">Interest</TableHead>
      <TableHead className="text-right border">Principal</TableHead>
      <TableHead className="text-right border "><span>Cumulative </span><br /><span>Payment</span></TableHead>
      <TableHead className="text-right border">Balance</TableHead>
      <TableHead className="text-right border border-r-4  "><span>Prepayment </span><br /><span>Amount</span></TableHead>

      <TableHead className="text-right border">Rate</TableHead>
      <TableHead className="text-right border">Payment</TableHead>
      <TableHead className="text-right border">Interest</TableHead>
      <TableHead className="text-right border">Principal</TableHead>
      <TableHead className="text-right border "><span>Cumulative </span><br /><span>OD Balance</span></TableHead>

      <TableHead className="text-right border">Balance</TableHead>
      <TableHead className="text-right border "><span>Effective </span><br /><span>Balance</span></TableHead>

      <TableHead className="text-right border ">OD Deposit</TableHead>
    </TableRow>
  </TableHeader>
}
const AmortizationTableOriginalRow = memo(({ idx, rate, rateOD, additionalEMI, prepayInput, odInput, schedule, handleInputChange }: AmortizationTableRowProps) => {
  console.log('row' + idx);
  const normal = schedule.original;
  const prepay = schedule.prepayment;
  const od = schedule.od;




  const className = od?.isInterestFree ? " text-gray-400" : "";
  return <TableRow key={idx}>
    <TableCell className="border text-center">{normal?.month}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.emi) : null}</TableCell>

    <TableCell >
      <Input type="number" className="text-right  min-w-28" value={additionalEMI} onChange={(e) => handleInputChange('AdditionalEMI', idx, e.target.valueAsNumber)} />
    </TableCell>
    <TableCell >
      <Input type="number" className="text-right  min-w-28" value={rate} onChange={(e) => handleInputChange('InterestRate', idx, e.target.valueAsNumber)} />
    </TableCell>

    <TableCell className="border text-right">{normal ? intl.format(normal.payment) : null}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.openingBalance) : null}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.interest) : null}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.principal) : null}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.balance) : null}</TableCell>





  </TableRow>
});

const AmortizationTablePrepaymentRow = memo(({ idx, rate, rateOD, additionalEMI, prepayInput, odInput, schedule, handleInputChange }: AmortizationTableRowProps) => {
  console.log('row' + idx);
  const normal = schedule.original;
  const prepay = schedule.prepayment;
  const od = schedule.od;




  const className = od?.isInterestFree ? " text-gray-400" : "";
  return <TableRow key={idx}>
    <TableCell className="border text-center">{normal?.month}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.emi) : null}</TableCell>

    <TableCell >
      <Input type="number" className="text-right  min-w-28" value={additionalEMI} onChange={(e) => handleInputChange('AdditionalEMI', idx, e.target.valueAsNumber)} />
    </TableCell>
    <TableCell >
      <Input type="number" className="text-right  min-w-28" value={rate} onChange={(e) => handleInputChange('InterestRate', idx, e.target.valueAsNumber)} />
    </TableCell>





    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.payment) : null}</TableCell>


    <TableCell className="">
      {!!prepay && <Input type="number" className={`text-right min-w-28`} value={prepayInput} onChange={(e) => handleInputChange('Prepayment', idx, e.target.valueAsNumber)} />}
    </TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.effectiveBalance) : null}</TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.cumulative) : null}</TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.interest) : null}</TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.principal) : null}</TableCell>
    <TableCell className={`${prepay ? "border" : ""} text-right`}>{prepay ? intl.format(prepay.balance) : null}</TableCell>



  </TableRow>
});

const AmortizationTableODRow = memo(({ idx, rate, rateOD, additionalEMI, prepayInput, odInput, schedule, handleInputChange }: AmortizationTableRowProps) => {
  console.log('row' + idx);
  const normal = schedule.original;
  const prepay = schedule.prepayment;
  const od = schedule.od;




  const className = od?.isInterestFree ? " text-gray-400" : "";
  return <TableRow key={idx}>
    <TableCell className="border text-center">{normal?.month}</TableCell>
    <TableCell className="border text-right">{normal ? intl.format(normal.emi) : null}</TableCell>

    <TableCell >
      <Input type="number" className="text-right  min-w-28" value={additionalEMI} onChange={(e) => handleInputChange('AdditionalEMI', idx, e.target.valueAsNumber)} />
    </TableCell>




    <TableCell >
      <Input type="number" className="text-right  min-w-28" value={rateOD} onChange={(e) => handleInputChange('InterestRateOD', idx, e.target.valueAsNumber)} />
    </TableCell>

    <TableCell className={`${className} ${prepay ? "border" : ""} text-right`}>{od ? intl.format(od.payment) : null}</TableCell>
    <TableCell >
      {!!od && <Input type="number" className="text-right  min-w-28" value={odInput} onChange={(e) => handleInputChange('OD', idx, e.target.valueAsNumber)} />}
    </TableCell>
    {/* <TableCell className={`${className} ${prepay ? "border" : ""} text-right`}>{od ? intl.format(od.effectiveBalance) : null}</TableCell> */}
    <TableCell className={`${className} ${prepay ? "border" : ""} text-right`}>{od ? intl.format(od.cumulative) : null}</TableCell>
    <TableCell className={`${className} ${prepay ? "border" : ""} text-right`}>{od ? intl.format(od.interest) : null}</TableCell>
    <TableCell className={`${className} ${prepay ? "border" : ""} text-right`}>{od ? intl.format(od.principal) : null}</TableCell>
    <TableCell className={`${className} ${prepay ? "border" : ""} text-right`}>{od ? intl.format(od.balance) : null}</TableCell>
    <TableCell className={`${className} ${prepay ? "border" : ""} text-right`}>{od ? intl.format(od.effectiveBalanceEnd) : null}</TableCell>




  </TableRow>
});