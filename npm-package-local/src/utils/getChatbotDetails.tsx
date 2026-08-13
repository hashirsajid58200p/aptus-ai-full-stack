import axios from "axios";

const getChatbotDetails = async (token: string, apiUrl: string) => {
  try {
    const response = await axios.get(`${apiUrl}/user/token/verify`, {
        params: {
            token: token,
            _cb: new Date().getTime(),
            },
    });

    return response.data.data;

  } catch (error) {
    throw new Error("Something went wrong while fetching chatbot details");
  }
};

export default getChatbotDetails;
