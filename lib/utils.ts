export function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
    }).format(price) + ' FCFA';
}

export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}
