export const isPasswordFormat = (password) => ({
	isEightChars: password.length >= 8,
	hasLowercase: /[a-z]/.test(password),
	hasNumber: /\d/.test(password),
	hasUppercase: /[A-Z]/.test(password)
});
