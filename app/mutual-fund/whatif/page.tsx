
import { use } from "react";
import { readFile } from "fs/promises";
import { WhatIfView } from "./WhatIfView";
import { Banner } from "./Banner";


export default function Page() {

    const json = use(readFile('src/lib/schemes', 'utf-8'));
    const baseUrl = process.env.FUNDURL || 'https://raw.githubusercontent.com/whatifmoney/public-data/main';
    return <div className="flex flex-col lg:items-center  print:items-start">
        <Banner  href={"/mutual-fund/whatif"} title={"Mutual Fund - What If ?"} subTitle={"Play a What If scenario and compare fund performances."} footer={"Disclaimer: The values shown below are aproximate and for personal use only. Please consult your mutual fund advisor/AMC for accurate calculations."} />
        <section className="m-4 lg:w-4/5 print:m-1 print:w-full">
            <WhatIfView json={json} baseUrl={baseUrl} />
        </section>
    </div>;
}

