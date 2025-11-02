export const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short"
    })

}