'use client'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Label } from '@/components/ui/label'

export default ({ error }: { error: Error }) => {
    return (
        <Collapsible >
                <section className="grid justify-items-center content-center h-[80vh]">
                    <Label>An error has occured proccesing your request.</Label>
                    <Label>{error.message}</Label>
                    <CollapsibleTrigger><Button variant={'link'}>More Info</Button></CollapsibleTrigger>
                </section>
                <CollapsibleContent>
                    <pre>{error.stack}</pre>
                </CollapsibleContent>
        </Collapsible>
    )
}