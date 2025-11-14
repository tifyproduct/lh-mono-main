export function collectionUrlValidator({ parentMenu, category, brandHandle, handle, params }: { parentMenu: string, category: string | null, brandHandle: string | null, handle: string, params: any }) {
    const group = parentMenu ? parentMenu : params.handle;
    const baseUrl = `/${params.store}/${params.lang}/${group}`;
    const isSubBrand = category?.toLowerCase().includes('sub') ? true : false;
    const isBrand = category?.toLowerCase().includes('brand') ? true : false;
    const otherCategory = category ?? 'category';

    let url = baseUrl;

    // Sub Brand 
    if (isSubBrand && brandHandle) {
        url = `${baseUrl}/${brandHandle}/${handle}`;
    } else if (isBrand) {
        url = `${baseUrl}/${handle}`;
    
    // Using Default Category
    // Jewelry Explore By Case in Jewelry Landing Page
    } else if (otherCategory && (parentMenu?.toLowerCase() === params.handle)) {
        url = `${baseUrl}/${otherCategory}/${handle}`;
    } else if (!parentMenu && !category) {
        url = `${baseUrl}/${otherCategory}/${handle}`;
    } else if (parentMenu && category) {
        url = `${baseUrl}/${otherCategory}/${handle}`;
    }

    return url.toLowerCase();
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isCountryCodeMatch(phoneNumber: string, store: 'id' | 'sg'): boolean {
    const countryCodeMap: { [key: string]: string } = {
        'id': '+62',
        'sg': '+65'
    };

    if (phoneNumber.length < 3) {
        return false;
    }

    return phoneNumber.slice(0, 3) === countryCodeMap[store];
}

// Only handle ID (+62) and SG (+65)
export function isValidPhoneNumber(phoneNumber: string): boolean {
    // to check country code following by numbers
    const regex = /^\+(62|65)\d+$/;

    return regex.test(phoneNumber);
}

// Min 8 char, include lowercase, contain 1 number, contain 1 uppercase, non white space
export function isValidPassword(password: string): boolean {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    return regex.test(password);
}