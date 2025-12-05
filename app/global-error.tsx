'use client'
import { Label } from '@/components/ui/label'

export default ({ error }: { error: Error }) => {
    return (
        <html>
            <body>
                <section className="grid justify-items-center content-center h-[80vh]">
                    <Label>An error has occured proccesing your request.</Label>
                    <Label>{error.message}</Label>
                </section>
            </body>
        </html>
    )
}