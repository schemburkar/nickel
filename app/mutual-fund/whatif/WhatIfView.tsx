'use client';
import { Suspense, useEffect, useMemo, useState } from "react";
import { Select } from "../(components)/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Result, evaluate } from "@/lib/fund/valuation";
import { Label } from "@/components/ui/label";
import { subYears } from "date-fns";
import { Icons } from "../../../components/icons";
import { Row } from "../(components)/Row";
import { XIRR } from "../(components)/XIRR";
import { SchemeCode } from "../(components)/scheme";

export const WhatIfView = ({ json }: { json: string }) => {
    const [value, setValue] = useState<{ value: string, label?: string }>({ value: "", label: "" })
    const [data, setData] = useState<{ schemeId: string; scheme?: string; result: Result | null; }[]>([])
    const [whatIf1, setwhatIf1] = useState<{ value: string, label?: string }>({ value: "", label: "" })
    const [whatIf2, setwhatIf2] = useState<{ value: string, label?: string }>({ value: "", label: "" })
    const [rows, setRows] = useState([{ id: new Date().getTime(), Amount: 5000, Date: subYears(new Date(), 1), Months: 12 }])
    const jsondata = useMemo(() => JSON.parse(json).map((a: SchemeCode) => ({ value: a.SchemeCode, label: a.Name })), [json])
    const intl = new Intl.NumberFormat("en-IN", { style: 'currency', currency: 'INR', })


    useEffect(() => {
        const fetchData = async () => {
            if (typeof localStorage !== 'undefined' && value.value) {
                const result = evaluate({
                    schemeId: value.value,
                    sip: rows
                });

                const result1 = whatIf1.value ? evaluate({
                    schemeId: whatIf1.value,
                    sip: rows
                }) : null;

                const result2 = whatIf2.value ? evaluate({
                    schemeId: whatIf2.value,
                    sip: rows
                }) : null;

                const [data1, data2, data3] = await Promise.all([result, result1, result2])

                setData([
                    {
                        schemeId: value.value,
                        scheme: value.label,
                        result: data1
                    },
                    {
                        schemeId: whatIf1.value,
                        scheme: whatIf1.label,
                        result: data2
                    },
                    {
                        schemeId: whatIf2.value,
                        scheme: whatIf2.label,
                        result: data3
                    }
                ]); 
            }
        };

        fetchData();
    }, [rows, value, whatIf1, whatIf2]);



    return <div className="flex flex-col gap-2 gap-y-4">

        <section className="flex flex-col gap-2  w-2/3">

            <Label>Fund</Label>
            <Label className="font-normal text-sm">Select a fund that you would like to compare its performance</Label>
            <Select className="w-full" popover={({ className: 'w-full' })} source={jsondata} value={value.value} onSelect={(value, label) => setValue({ value, label })} placeholder="Select Fund" emptyContent={(q: any) => `No fund found with text "${q}"`} />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-right w-1/4">SIP Amount</TableHead>
                        <TableHead className="w-1/4">Date</TableHead>
                        <TableHead className="text-right  w-1/4">No of Months</TableHead>
                        <TableHead className="w-1/4 text-right">   </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, i) => <Row key={row.id} row={row} setRow={(r) => setRows([...rows.slice(0, i), r, ...rows.slice(i + 1)])} canDelete={rows.length > 1} onDeleteRow={() => setRows([...rows.slice(0, i), ...rows.slice(i + 1)])} />)}

                </TableBody>
            </Table>

            <Button className="self-start group w-auto gap-0" disabled={rows.length === 3} onClick={() => setRows([...rows, { id: new Date().getTime(), Amount: 5000, Date: subYears(new Date(), 1), Months: 12 }])} ><Icons.add /><span className="inline-block whitespace-nowrap overflow-hidden group-hover:max-w-24 max-w-0 transition-[max-width] duration-700 ease-in-out"><span className="w-2 inline-block"></span>Add SIP</span></Button>
        </section>




        <section className="flex flex-col gap-2 w-2/3">

            <Label >What If 1</Label>
            <Label className="font-normal text-sm">Select a another fund to do a What If analysis</Label>
            <Select className="w-full" popover={({ className: 'w-full' })} source={jsondata} value={whatIf1.value} onSelect={(value, label) => setwhatIf1({ value, label })} placeholder="Select WhatIf Fund" emptyContent={(q: string) => `No fund found with text "${q}"`} />
        </section>

        <section className="flex flex-col gap-2  w-2/3">

            <Label>What If 2</Label>
            <Label className="font-normal text-sm">Select a another fund to do a What If analysis</Label>
            <Select className="w-full" popover={({ className: 'w-full' })} source={jsondata} value={whatIf2.value} onSelect={(value, label) => setwhatIf2({ value, label })} placeholder="Select WhatIf Fund" emptyContent={(q: string) => `No fund found with text "${q}"`} />
        </section>

        <>
            <Label>Results</Label>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="">Fund</TableHead>
                        <TableHead className="text-right">Invested</TableHead>
                        <TableHead className="text-right">Current Value</TableHead>
                        <TableHead className="text-right">Gain/loss</TableHead>
                        <TableHead className="text-right">XIRR</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {!!data.length ? <>
                        {data.map((a, i) => (!!a.schemeId && !!a.result && <TableRow key={`${i}-${a.scheme}`}>
                            <TableCell className=""> {a.scheme} </TableCell>
                            <TableCell className="text-right"> {intl.format(a.result?.invested)} </TableCell>
                            <TableCell className="text-right"> {intl.format(a.result?.value)} </TableCell>
                            <TableCell className="text-right"> {intl.format(a.result?.value - a.result?.invested)} </TableCell>
                            <TableCell className="text-right">   <Suspense fallback={<div>WAIT</div>}>{a.result?.xirr ? <XIRR p={a.result?.xirr} /> : null} </Suspense></TableCell>

                        </TableRow>))}
                    </> :
                        <TableRow>
                            <TableCell colSpan={5} className="text-center p-5">No data to show</TableCell>
                        </TableRow>
                    }

                </TableBody>
            </Table>
        </>
        {/* <pre className="text-xs ">{JSON.stringify(data || [], null, 4)}</pre> */}

    </div>
}



