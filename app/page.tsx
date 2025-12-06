import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className=" bg-linear-to-b from-white via-muted/50 to-white dark:from-background dark:via-gray-900 dark:to-background grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-[calc(100vh-10rem)] p-4  gap-16 sm:p-20 font-(family-name:--font-geist-sans)">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
      
        <p className="text-2xl"><img className="inline h-6"  src="/favicon.svg"/> zero nickels</p>
        <section className="grid grid-row-3 lg:grid-cols-3 gap-4 row-start-2 w-4/5 ">

          <Card>
            <CardHeader>
              <CardTitle>  Mutual Fund</CardTitle>
              <CardDescription>Choose the right mutual fund by using tools such
                as What If, Fund COmpare and more. Get started now!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2  ">

              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
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
                className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
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
                className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
                href="/itr/selector"
              >
                <div className="mb-2 text-lg font-medium">
                  Regime Selection
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  You decide what is benefitial for you.
                </p>
              </a>
              <a
                className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
                href="/itr/checklist"
              >
                <div className="mb-2 mt-4 text-lg font-medium">
                Returns Filing Checklist
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                Mark documents as you collect them
                </p>
              </a>

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
                className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
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
                className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
                href="/home-loan/payment-schedule-od"
              >
                <div className="mb-2 text-lg font-medium">
                Payment schedule with Max Gain
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                Know how much interest you pay every month and save with &quot;Max Gain&quot;
                </p>
              </a>

            </CardContent>

          </Card>
        </section>


      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/schemburkar/nickel"
          target="_blank"
          rel="noopener noreferrer"
        >
          Project Repository
        </a>
      </footer>
    </div>
  );
}
