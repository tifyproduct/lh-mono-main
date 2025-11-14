export const replaceSecondOccurrence = (path: string, target: number, replacement: string) => {
    let parts = path.split("/");
    let count = 0;

    for (let i = 0; i < parts.length; i++) {
        if (count === 2) {
            parts[i] = replacement;  // Replace the second occurrence
            break;
        }
    }

    return parts.join("/");
}

export const encodeFilterParams = (filters: string): string => {
    return btoa(encodeURIComponent(filters));
}

export const decodeFilterParams = (encodedFilters: string): string => {
    const decoded = decodeURIComponent(atob(encodedFilters))
    return decoded;
}