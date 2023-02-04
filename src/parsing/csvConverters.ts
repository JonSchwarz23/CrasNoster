const toNumber = (value: string) => Number(value);
const fromPercentageToNumber = (value: string) => Number(value.substring(0, value.length - 1));
const keepString = (value: string) => value;

export { toNumber, fromPercentageToNumber, keepString };
