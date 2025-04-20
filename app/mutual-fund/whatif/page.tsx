
import { use } from "react";
import { readFile } from "fs/promises";
import { WhatIfView } from "./WhatIfView";



export default function Page() {

    const json = use(readFile('lib/schemes', 'utf-8'));

    return <div className="flex flex-col items-center  print:items-start">
        <section className="m-4 w-4/5 print:hidden">
            <a className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/itr/selector">
                <div className="mb-2 mt-4 text-lg font-medium">
                    Mutual Fund - What If ?
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                    Play a What If scenario and compare fund performances.
                </p>
                <p className="text-sm leading-7 text-muted-foreground ">
                    Disclaimer: The values shown below are aproximate and for personal use only. Please consult your mutual fund advisor/AMC for accurate calculations.
                </p>
            </a>
        </section>
        <section className="m-4 w-4/5 print:m-1 print:w-full">


            <WhatIfView json={json} />


        </section>
    </div>;
}

