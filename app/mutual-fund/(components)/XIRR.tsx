'use client';
import { use } from "react";

export const XIRR = ({ p }: { p: Promise<number>; }) => {
    const intl2 = new Intl.NumberFormat("en-IN", { style: 'percent', minimumFractionDigits: 2 });
    const v = use(p);
    return <>{intl2.format(v)}</>;
};
