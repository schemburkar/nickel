'use client';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { AppName } from "@/utils/constants";
import Link from "next/link";
import { forwardRef, useCallback } from "react";
import { useTheme } from "next-themes"

export const Nav = () => {
    const { setTheme, resolvedTheme } = useTheme()

    const toggleTheme = useCallback(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }, [resolvedTheme, setTheme])
    return (
        <header >
            <nav className="flex p-2 not-lg:flex-col items-baseline">
                <a className=" hidden print:block text-xl" href="/"><img className="inline h-6" src="/favicon.svg" /> {AppName}</a>
                <NavigationMenu className="print:hidden">
                    <NavigationMenuList>

                        <NavigationMenuLink className="text-xl pt-1" href="/">
                            <span ><img className="inline h-6" src="/favicon.svg" /> {AppName}</span>
                        </NavigationMenuLink>


                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Mutual Fund</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
                                                href="/mutual-fund/portfolio"
                                            >
                                                {/* <Icons.logo className="h-6 w-6" /> */}
                                                <div className="mb-2 mt-4 text-lg font-medium">
                                                    Mutual Fund Tools
                                                </div>
                                                <p className="text-sm leading-tight text-muted-foreground">
                                                    Choose the right mutual fund by using tools such
                                                    as What If, Fund COmpare and more. Get started now!
                                                </p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                    <ListItem href="/mutual-fund/portfolio" title="Portfolio">
                                        Build your fund portfolio
                                    </ListItem>
                                    <ListItem href="/mutual-fund/whatif" title="What If ?">
                                        Play a What If scenario and decide your fund performance
                                    </ListItem>
                                    {/* <ListItem href="/docs/installation" title="Fund Info">
                                        Get basic fund Info
                                    </ListItem> */}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Income Tax</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">

                                    <ListItem href="/itr/selector" title="Regime Selection">
                                        You decide what is benefitial for you.
                                    </ListItem>
                                    <ListItem href="/itr/checklist" title="Returns Filing Checklist">
                                        Mark documents as you collect them.
                                    </ListItem>
                                    {/* <ListItem href="/docs/primitives/typography" title="Tax checklist">
                                        List of items you wnat to know before filing your returns
                                    </ListItem> */}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Home Loan</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">

                                    <ListItem href="/home-loan/payment-schedule" title="Payment schedule">
                                        Know how much interest you pay every month
                                    </ListItem>
                                    <ListItem href="/home-loan/payment-schedule-od" title="Payment schedule with Max Gain">
                                        Know your interest payment and save with &quot;Max Gain&quot;
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
                <div className="flex justify-end grow print:hidden">

                    <Toggle onClick={toggleTheme}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-4.5"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                            <path d="M12 3l0 18" />
                            <path d="M12 9l4.65 -4.65" />
                            <path d="M12 14.3l7.37 -7.37" />
                            <path d="M12 19.6l8.85 -8.85" />
                        </svg>
                    </Toggle>
                </div>
            </nav>
        </header>);
}


const ListItem = forwardRef<
    HTMLAnchorElement,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = 'ListItem'