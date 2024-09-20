
//   import { getCookie } from "../../../utilities/cookieServices/cookieServices";
//   import { isUserIdCookieName, titleCaseFirstWord } from "../../../utilities/generals";
//   import { decodeData } from "../../../utilities/securities/encodeDecode";

import { get } from "../../views/utilities/apiservices/apiServices";

  

  export const getDynamicPages = async () => {
    try {
      // Send the GET request to the user API endpoint
      const response = await get("gpt/getGeneratedPageDetails", "python");
      // Return the response data
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  