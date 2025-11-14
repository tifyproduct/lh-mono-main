export interface Pagination {
    page: number;
    perPage: number;
    total: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface PaginationResult<T> {
    data: T[];
    pagination: Pagination;
}



/**
 * Performs manual pagination on an array of objects.
 * @param data - The array of objects to be paginated.
 * @param page - The current page number.
 * @param perPage - The number of items to be displayed per page.
 * @returns An object containing the paginated data, page information, and paging status.
 */
export function paginate<T>(data: T[], page: number = 1, perPage: number = 10): PaginationResult<T> {
    const validPage = Math.max(1, page);
    const validPerPage = Math.max(1, perPage);

    const total = data.length;
    const offset = (validPage - 1) * validPerPage;

    const paginatedData = data.slice(offset, offset + validPerPage);

    return {
        data: paginatedData,
        pagination: {
            page: validPage,
            perPage: validPerPage,
            total,
            hasNext: offset + validPerPage < total,
            hasPrevious: validPage > 1,
        }
    };
};

export const paginationFormatter = (c: number, m: number) => {
    const current = c;
    const last = m;
    const delta = 2;
    const left = current - delta;
    const right = current + delta + 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || (i >= left && i < right)) {
            range.push(i);
        }
    }
    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }
    return rangeWithDots;
};