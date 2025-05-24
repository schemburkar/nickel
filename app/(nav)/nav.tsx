'use client';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { AppName } from "@/utils/constants";
import Link from "next/link";
import { forwardRef } from "react";

export const Nav = () => {
    return (
        <header >
            <nav className="flex p-2 items-baseline">
                <a className="text-xl" href="/"><img className="inline h-6"  src="/favicon.svg"/> {AppName}</a>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Mutual Fund</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                    <li className="row-span-3">
                                        <NavigationMenuLink asChild>
                                            <Link
                                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
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
                                    <ListItem href="/home-loan/payment-schedule-od" title="Compare with OD/Max Gain account">
                                        How your loan reduces with OD account like &quot;Max Gain&quot;
                                    </ListItem>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>
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
ListItem.displayName='ListItem'