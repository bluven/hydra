function getErrorMessage(e: any): string {
    if (typeof e === 'string') {
        return e
    } else if (e instanceof Error) {
        return e.message
    } else {
        return e.toString()
    }
}

export default {
    getErrorMessage
}