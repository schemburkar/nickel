import Axios from "axios";
import { buildWebStorage, setupCache } from "axios-cache-interceptor";
import { xirr } from "../xirr/xirr";
import { addMonths } from "date-fns";


export type Fund = {
    schemeId: string;
    sip: SIP[];
}

export type SIP = {
    Amount: number;
    Date: Date;
    Months: number;
}
export type Result = {
    invested: number;
    value: number;
    transactions: {
        no: number;
        total: number;
        Date: Date;
        Amount: number;
        nav: number | null;
        applicableDate: Date | null;
    }[];
    xirr: Promise<number>;
}


const getTransactions = (fund: Fund, latestDate: Date) => {

    const results = [];
    for (const sip of fund.sip) {
        const transaction = [];
        for (let index = 0; index < sip.Months; index++) {
            const date = addMonths(sip.Date, index);

            if (date > latestDate)
                continue;
            // const date = new Date(sip.Date);


            // date.setMonth(sip.Date.getMonth() + index);

            // // Handle edge cases where the new month has fewer days
            // if (date.getDate() !== sip.Date.getDate()) {
            //     date.setDate(0); // Set to the last day of the previous month
            // }
            transaction.push({ no: index + 1, total: sip.Months, Date: date, Amount: sip.Amount, nav: null as number | null, applicableDate: null as Date | null });

        }
        results.push(...transaction);
    }
    return results;
}

export const evaluate = async (fund: Fund): Promise<Result> => {


    const instance = Axios.create();
    const axios = setupCache(instance, {
        storage: buildWebStorage(global.localStorage, 'fund-evaluate'),
        ttl: 1000 * 60 * 60 * 5 // 5 hrs
    });

    const baseUrl = process.env.FUND || 'https://raw.githubusercontent.com/whatifmoney/public-data/main' || 'http://localhost:5002/money/master';
    //const res = await axios.get<string>(`${baseUrl}/mutual-funds/nav/${fund.schemeId}`, { method:"GET",   headers:{ "Accept":"*/*", "Content-Type":"text/plain"},  });

    const res = { data : await (await fetch(`${baseUrl}/mutual-funds/nav/${fund.schemeId}`)).text() };
    // Parse the response into an array of date and NAV pairs
    const navData: { date: Date; nav: number }[] = res.data.split('\n').map(line => {
        const [date, nav] = line.split(' ');
        return { date: new Date(date), nav: parseFloat(nav) };
    }).sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date in ascending order;

    // Helper function to find the applicable NAV for a single target date
    const findApplicableNav = (targetDate: string): [number, Date] | null => {
        const target = new Date(targetDate);
        for (const entry of navData) {
            if (entry.date.getTime() >= target.getTime()) {
                return [entry.nav, entry.date];
            }
        }
        return null; // If no applicable NAV is found
    };

    const lastNav = navData[navData.length - 1].nav;
    const lastDate = navData[navData.length - 1].date;
    const transactions = getTransactions(fund, lastDate);
    const dates = [...new Set([...transactions.map(a => a.Date.toISOString()), lastDate.toISOString()])];
    // Create a result map for each target date
    const results: Record<string, [number, Date] | null> = {};
    for (const date of dates) {
        const result = findApplicableNav(date);
        results[date] = result;

    }

    for (let index = 0; index < transactions.length; index++) {
        const element = transactions[index];
        const result = results[element.Date.toISOString()];
        if (!result) continue;
        const [nav, applicableDate] = result
        element.nav = nav;
        element.applicableDate = applicableDate;
    }


    const invested = transactions.map(t => t.Amount).reduce((acc, curr) => acc + curr, 0)
    const value = transactions.map(t => t.Amount / (t.nav || 1) * lastNav).reduce((acc, curr) => acc + curr, 0)
    const xirrPromise = new Promise<number>(resolve => setTimeout(() => resolve(xirr([...transactions.map(t => ({ Amount: -t.Amount, Date: t.Date })), { Amount: value, Date: lastDate }])), 1000));
    const data = { invested, value, transactions, xirr: xirrPromise };
    return data;
}