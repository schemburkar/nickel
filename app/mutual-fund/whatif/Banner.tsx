export const Banner = ({ href, title, subTitle, footer }) => {
    return <section className="m-4 lg:w-4/5 print:hidden">
        <a className="flex h-full w-full select-none flex-col justify-end rounded-md card-highlight p-6 no-underline outline-none focus:shadow-md"
            href={href}>
            <div className="mb-2 mt-1 text-lg font-medium">
                {title}
            </div>
            <p className="text-sm mb-1 leading-tight text-muted-foreground">
                {subTitle}
            </p>
            <p className="text-sm leading-5 md:leading-7 text-muted-foreground ">
                {footer}
            </p>
        </a>
    </section>;
};
