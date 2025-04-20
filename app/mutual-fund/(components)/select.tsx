"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { defaultFilter } from 'cmdk'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type SelectParams<T = string> = {
    source: { value: T, label: string }[]
    value: any
    onSelect: (value: T, label: string) => void
    placeholder: string
    className?: string
    popover: {
        className?: string
    }
    emptyContent: React.ReactNode | ((query: string) => React.ReactNode)
}


export function Select({ source, value, onSelect, placeholder, className, emptyContent, popover }: SelectParams) {
    const [open, setOpen] = React.useState(false)

    const [query, setQuery] = React.useState('');

    const filteredItems = source.map((item) => ({ ...item, score: query ? defaultFilter(item.label, query, []) : 1 })).sort((a, b) => b.score - a.score);

    // const highlightMatch = (text, query) => {
    //     const parts = text.split(new RegExp(`(${query})`, 'gi'));
    //     return parts.map((part, index) =>
    //         part.toLowerCase() === query.toLowerCase() ? <span className="font-medium" key={index}>{part}</span> : <span>{part}</span>
    //     );
    // };
    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-[200px] justify-between", className)}                >
                    {value
                        ? source.find((item) => item.value === value)?.label
                        : (placeholder || "Select...")}
                    {/* <i>{value}</i> */}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-[200px] p-0", popover?.className)}>
                <Command shouldFilter={false} >
                    <CommandInput placeholder={(placeholder || "Select...")} value={query} onValueChange={(e) => setQuery(e)} />
                    <CommandList>
                        <CommandEmpty>{(typeof emptyContent === "function" ? emptyContent(query) : emptyContent) || 'No results found.'}</CommandEmpty>
                        <CommandGroup>
                            {filteredItems.splice(0, 200).filter(a => a.score > 0.01).map((item) => (
                                <CommandItem
                                    key={item.value} data-key={item.value}
                                    value={item.value}
                                    onSelect={(currentValue) => {
                                        onSelect(currentValue === value ? "" : currentValue, currentValue === value ? "" : item.label)
                                        setOpen(false)
                                    }}                                >
                                    {item.label}
                                    <Check className={cn("ml-auto", value === item.value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
