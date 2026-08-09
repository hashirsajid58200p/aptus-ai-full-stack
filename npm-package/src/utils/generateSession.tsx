import axios from "axios";

const generateSession = async ({
  email,
  username,
  chatbotId,
  apiUrl,
}: {
  email: string;
  username: string;
  chatbotId: string;
  apiUrl: string;
}) => {
  try {
    const response = await axios.post(`${apiUrl}/session/create`, {
      email,
      username,
      chatbotId,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while generating session");
  }
};

export default generateSession;
