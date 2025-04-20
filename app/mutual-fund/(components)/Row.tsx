'use client';
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./date";
import { Icons } from "../../../components/icons";

type RowProps = {
    row: {
        id: number;
        Amount: number;
        Date: Date;
        Months: number;
    }; setRow: (r: {
        id: number;
        Amount: number;
        Date: Date;
        Months: number;
    }) => void; canDelete: boolean; onDeleteRow: () => void;
};
export const Row = ({ row, setRow, canDelete, onDeleteRow }: RowProps) => {
    return <TableRow key={row.id}>
        <TableCell className="text-right">
            <Input defaultValue={row?.Amount} onChange={(e) => row && setRow({ ...row, Amount: e.target.valueAsNumber })} placeholder="Amount" className="text-right" type="number" />
        </TableCell>
        <TableCell className="">
            <DatePicker date={row?.Date} setDate={(d) => setRow({ ...row, Date: d })} />
        </TableCell>
        <TableCell className="text-right">
            <Input defaultValue={row?.Months} onChange={(e) => row && setRow({ ...row, Months: e.target.valueAsNumber })} placeholder="No of Months" className="text-right" type="number" />
        </TableCell>
        <TableCell className="text-right">
            <div className="flex  justify-end gap-2 ">
                <Button className="group w-auto hover:bg-red-800 gap-0" disabled={!canDelete} onClick={() => onDeleteRow()}><Icons.delete /><span className="inline-block whitespace-nowrap overflow-hidden group-hover:max-w-24 max-w-0 transition-[max-width] duration-700 ease-in-out"><span className="w-2 inline-block"></span>Delete SIP</span></Button>
            </div>
        </TableCell>
    </TableRow>;
};
