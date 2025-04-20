'use client';
import { ReactNode, Suspense, use, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Select } from "../(components)/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Result, evaluate, SIP } from "@/lib/fund/valuation";
import { Label } from "@/components/ui/label";
import { subYears } from "date-fns";
import { Icons } from "../../../components/icons";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Shim } from "@/app/itr/selector/Shim";
import { Row } from "../(components)/Row";
import { XIRR } from "../(components)/XIRR";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

type FundModel = {
    schemeId: string;
    schemeName: string
    sip: SIPModel[]
}

type SIPModel = SIP & {
    id: number
}
const defaultFund: FundModel = { schemeId: '', schemeName: '', sip: [{ id: new Date().getTime(), Amount: 5000, Date: subYears(new Date(), 1), Months: 12 }] };
export const PortfolioView = ({ json }: { json: string }) => {
    const [funds, setFunds] = useState<FundModel[]>([])
    const [results, setResults] = useState<(Promise<Result> | null)[]>([])



    const intl = new Intl.NumberFormat("en-IN", { style: 'currency', currency: 'INR', })
    const intl2 = new Intl.NumberFormat("en-IN", { style: 'percent', minimumFractionDigits: 2 })

    const jsondata = useMemo(() => JSON.parse(json).map((a: any) => ({ value: a.SchemeCode, label: a.Name })), [json])


    useLayoutEffect(() => {
        const fundsJSON = global.localStorage?.getItem('funds');
        const value: FundModel[] = fundsJSON ? JSON.parse(fundsJSON) : null;
        if (value && value.length > 0 && funds.every(f => !!f.schemeId))
            setFunds(value);

    }, [])


    useEffect(() => {
        const fetchData = async () => {
            if (typeof localStorage !== 'undefined') {

                var results = [];
                for (const fund of funds) {
                    console.log({ fund })
                    const result = fund.schemeId ? evaluate(fund) : null;
                    results.push(result);
                }

                setResults(results);

            }
        };

        fetchData();

        if (global.localStorage) {
            global.localStorage.setItem('funds', JSON.stringify(funds))
        }

    }, [funds]);





    const Results = ({ p }: { p: Promise<Result> }) => {
        const a = use(p);

        return <>
            <TableCell className="text-right"> {intl.format(a?.invested)} </TableCell>
            <TableCell className="text-right"> {intl.format(a?.value)} </TableCell>
            <TableCell className="text-right"> {intl.format(a?.value - a?.invested)} </TableCell>
            <TableCell className="text-right">   {a?.xirr ? <Suspense fallback={<div><Shim /></div>}> <XIRR p={a?.xirr} />  </Suspense> : null}</TableCell>
        </>;
    }

    const rowFallback = <>
        <TableCell className="text-right"> <Shim /> </TableCell>
        <TableCell className="text-right"> <Shim /></TableCell>
        <TableCell className="text-right"> <Shim /> </TableCell>
        <TableCell className="text-right"> <Shim />  </TableCell>
    </>;
    return <div className="flex flex-col gap-2 gap-y-4">
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

                {funds.map((f, i) => {

                    const result = results[i];
                    return <Dialog modal key={`${i}-${f.schemeId}`}>
                        <ContextMenu>
                            <ContextMenuTrigger asChild>

                                <TableRow >
                                    <TableCell className="">

                                        <DialogTrigger asChild>
                                            <Button variant={"link"}>{f.schemeName}</Button>
                                        </DialogTrigger>
                                        <DialogContent className="min-w-2/5 min-h-2/5">
                                            <DialogTitle>{f.schemeName || "New fund"}</DialogTitle>
                                            <Fund data={f} jsondata={jsondata} onUpdate={(fund) => { setFunds([...funds.slice(0, i), fund, ...funds.slice(i + 1)]); }} />
                                        </DialogContent>

                                    </TableCell>
                                    {result ? <Suspense fallback={rowFallback}><Results p={result} ></Results></Suspense> : rowFallback}
                                </TableRow>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => setFunds([...funds, { ...f }])}>Duplicate</ContextMenuItem>
                                <DialogTrigger asChild>
                                    <ContextMenuItem>Change fund/SIP</ContextMenuItem>
                                </DialogTrigger>
                                <ContextMenuItem onClick={() => setFunds([...funds.slice(0, i), ...funds.slice(i + 1)])} variant="destructive">Remove {f.schemeName}</ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    </Dialog>


                }
                )}
            </TableBody>
        </Table>
        <Dialog  modal open={funds.length === 0 ? true : undefined} >
            <DialogTrigger asChild>
                <Button className="self-start group w-auto gap-0" disabled={funds.length === 10} ><Icons.add /><span className="inline-block whitespace-nowrap overflow-hidden group-hover:max-w-24 max-w-0 transition-[max-width] duration-700 ease-in-out"><span className="w-2 inline-block"></span>Add Fund</span></Button>
            </DialogTrigger>
            <DialogContent className="min-w-2xl  min-h-2/5">
                <DialogTitle >{"New fund"}</DialogTitle>
                <Fund data={defaultFund} jsondata={jsondata} onUpdate={(fund) => setFunds([...funds, fund])} close={<>
                    <a className="self-end" href="/">
                    <Button variant={"outline"}>CANCEL</Button>
                    </a>
                </>} />
                
            </DialogContent>
        </Dialog>


    </div >
}

type FundProps = {
    jsondata: []
    data: FundModel,
    onUpdate: (fund: FundModel) => void
    close?:ReactNode
}
const Fund = ({ jsondata, data, onUpdate,close }: FundProps) => {
    const [sip, setSIP] = useState(data.sip)
    const [fund, setFund] = useState<{ schemeId: string, schemeName: string }>(data)

    return <>
        <section className="flex flex-col gap-4 justify-stretch ">
            <Label>Fund</Label>
            <Label className="font-normal text-sm">Select a fund that you would like to track its performance and value</Label>
            <Select className="w-full" popover={({ className: 'w-full' })} source={jsondata} value={fund.schemeId} onSelect={(value, label) => setFund({ schemeId: value, schemeName: label })} placeholder="Select Fund" emptyContent={(q: any) => `No fund found with text "${q}"`} />

            <Label>SIP Details</Label>

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
                    {sip.map((row, i) => <Row key={row.id} row={row} setRow={(r) => setSIP([...sip.slice(0, i), r, ...sip.slice(i + 1)])} canDelete={sip.length > 1} onDeleteRow={() => setSIP([...sip.slice(0, i), ...sip.slice(i + 1)])} />)}

                </TableBody>
            </Table>
            <Button className="self-start group w-auto gap-0" disabled={sip.length === 3} onClick={() => setSIP([...sip, { id: new Date().getTime(), Amount: 5000, Date: subYears(new Date(), 1), Months: 12 }])} ><Icons.add /><span className="inline-block whitespace-nowrap overflow-hidden group-hover:max-w-24 max-w-0 transition-[max-width] duration-700 ease-in-out"><span className="w-2 inline-block"></span>Add SIP</span></Button>
        </section>
        <DialogFooter>
            <DialogClose asChild>
                <Button disabled={!fund || !fund.schemeId || sip.length == 0 || sip.some(s => !s.Amount || !s.Date || !s.Months)} className="self-end group w-auto gap-0 " onClick={() => onUpdate({ ...fund, sip })} >Apply</Button>
            </DialogClose>
            {close}
        </DialogFooter>
    </>
}



