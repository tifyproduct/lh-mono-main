export const isEmpty = (val: string | null) => {
  if (!val) return true;
  return false
}

export const isNumber = (val: string) => {
  const regexNumber = new RegExp(/^\d+$/);
  return regexNumber.test(val);
}

export const isPhoneNumber = (val: string) => {
  const regexNumber = new RegExp(/^\+\d+$/);
  return regexNumber.test(val);
}

export const isEmail = (val: string) => {
  const regexEmail = new RegExp(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/);
  return regexEmail.test(val);
}