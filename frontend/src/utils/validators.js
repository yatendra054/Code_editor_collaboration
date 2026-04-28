// Input validation rules per language
export const INPUT_VALIDATORS = {
  javascript: (input) => ({ valid: true, message: "" }),
  python: (input) => ({ valid: true, message: "" }),
  java: (input) => {
    if (input.trim() === "") return { valid: true, message: "" };
    if (/^[\d\s]+$/.test(input)) return { valid: true, message: "" };
    if (/^".*"$/.test(input)) return { valid: true, message: "" };
    return {
      valid: false,
      message: "Java input should be numbers or strings in double quotes"
    };
  },
  cpp: (input) => {
    if (input.trim() === "") return { valid: true, message: "" };
    if (/^[\d\s]+$/.test(input)) return { valid: true, message: "" };
    if (/^".*"$/.test(input)) return { valid: true, message: "" };
    return {
      valid: false,
      message: "C++ input should be numbers or strings in double quotes"
    };
  }
};
