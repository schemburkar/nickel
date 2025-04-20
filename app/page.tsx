import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Num = () => {

  return <span className="inline-grid grid-cols-[1fr] grid-rows-[1fr] font-mono text-right">
    <span className="num relative col-1 row-1"></span>
    <span className="col-1 row-1">

      <span className="counter relative font-mono"></span>
      <span className="counter relative font-mono"></span>
      <span className="counter relative font-mono"></span>
    </span>
  </span>
}
export default function Home() {
  return (
    <div className=" bg-gradient-to-b from-white via-muted/50 to-white grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[calc(100vh-10rem)] p-4  gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center w-full">
        {/* <Image
          className="dark:invert self-center-safe"
          src="/nickel.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        <p className="text-2xl"><img className="inline h-6"  src="/favicon.svg"/> zero nickels</p>
        <section className="grid grid-row-3 lg:grid-cols-3 gap-4 row-start-2 w-4/5 ">

          {/* bg-gradient-to-b from-muted/50 to-muted hover:shadow-md hover:bg-accent */}
          <Card>
            <CardHeader>
              <CardTitle>  Mutual Fund</CardTitle>
              <CardDescription>Choose the right mutual fund by using tools such
                as What If, Fund COmpare and more. Get started now!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2  ">

              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/mutual-fund/portfolio"
              >
                <div className="mb-2  text-lg font-medium">
                  Portfolio
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Build your fund portfolio
                </p>
              </a>

              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/mutual-fund/whatif"
              >
                <div className="mb-2 text-lg font-medium">
                  What If ?
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Play a What If scenario and decide your fund performance
                </p>
              </a>
            </CardContent>

          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Income Tax</CardTitle>
              <CardDescription>Choose the right Income Tax regime by using tools such
                as Regime Selection and more. Get started now!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2  ">

              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/itr/selector"
              >
                <div className="mb-2 text-lg font-medium">
                  Regime Selection
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  You decide what is benefitial for you.
                </p>
              </a>
              {/* <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="#"
              >
                <div className="mb-2 mt-4 text-lg font-medium">
                More coming Soon!
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  &nbsp;
                </p>
              </a> */}

            </CardContent>

          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Home loan</CardTitle>
              <CardDescription>Choose the right Income Tax regime by using tools such
                as Regime Selection and more. Get started now!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2  ">

              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/home-loan/payment-schedule"
              >
                <div className="mb-2  text-lg font-medium">
                  Payment schedule
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Know how much interest you pay every month
                </p>
              </a>
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                href="/home-loan/payment-schedule-od"
              >
                <div className="mb-2 text-lg font-medium">
                  Compare with OD account
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  How your loan reduces with OD account like &quot;Max Gain&quot;
                </p>
              </a>

            </CardContent>

          </Card>
        </section>


      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/schemburkar/nickel"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Project Repository
        </a>
      </footer>
    </div>
  );
}
