export const phoneNumberTrimmer = (val: string): string => {
  let processedPhoneNumber: string = val;

  if (processedPhoneNumber.startsWith('+62')) {
    processedPhoneNumber = processedPhoneNumber.replace('+62', '');
  }

  if (processedPhoneNumber.startsWith('+65')) {
    processedPhoneNumber = processedPhoneNumber.replace('+62', '');
  }

  if (processedPhoneNumber.startsWith('0')) {
    processedPhoneNumber = processedPhoneNumber.replace('0', '');
  }

  return processedPhoneNumber;
}

export const getCountryCodeFromPhoneNumber = (phoneNumber: string): 'SG' | 'ID' => {
  if (phoneNumber.slice(0, 3) === '+65') {
    return "SG"
  }

  return "ID"
}