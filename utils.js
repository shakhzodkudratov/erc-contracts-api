export async function errorHandler(fn) {
    try {
        return [await fn(), undefined]
    } catch (error) {
        return [undefined, error]
    }
}