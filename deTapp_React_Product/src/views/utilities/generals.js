import { encodeData } from "./securities/encodeDecode";
import { validationRegex } from "./Validators";


export const encodedSessionDetailsCookieName = encodeData("sessionsDetails")
export const encodedTempUsersCookieName = encodeData("tempUsers")


export const allValuesContainNumberInArray = (arr) => {
  const numberRegex = validationRegex.isNumbers;
  return arr.every((value) => numberRegex.test(value));
};

export const titleCaseFirstWord = (sentence) => {
  // Check if the input is a string
  if (typeof sentence !== "string") {
    throw new TypeError("Input must be a string");
  }
  const words = sentence.trim().split(" ");

  if (words.length > 0 && words[0].length > 0) {
    words[0] =
      words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  return words.join(" ");
};
