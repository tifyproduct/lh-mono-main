export interface BreadcrumbData {
    title: string;
    url?: string | null;
}

export type BreadcrumbProps = {
    label: string;
    href?: string
}
