
import { use } from "react";
import { readFile } from "fs/promises";
import { PortfolioView } from "./PortfolioView";
import { Banner } from "../whatif/Banner";



export default function Page() {

    const json = use(readFile('src/lib/schemes', 'utf-8'));
    const baseUrl = process.env.FUNDURL ||  'https://raw.githubusercontent.com/whatifmoney/public-data/main';

    return <div className="flex flex-col items-center  print:items-start">
        
        <Banner  href={"/mutual-fund/portfolio"} title={"Mutual Fund - Portfolio"} subTitle={"Build your fund portfolio"} footer={"Disclaimer: The values shown below are aproximate and for personal use only. Please consult your mutual fund advisor/AMC for accurate calculations."} />

        <section className="m-4 w-4/5 print:m-1 print:w-full">
            <PortfolioView json={json} baseUrl={baseUrl} />
        </section>
    </div>;
}

