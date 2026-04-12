export const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short"
    })
}

export const formatMoney = (value: unknown) => {
    const n = Number(value);
    if (Number.isNaN(n)) return '—';
    
    return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}