import axios from "axios";

const generateSession = async ({
  email,
  username,
  token,
  apiUrl,
}: {
  email: string;
  username: string;
  token: string;
  apiUrl: string;
}) => {
  try {
    const response = await axios.post(`${apiUrl}/session/create`, {
      email,
      username,
      token,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while generating session");
  }
};

export default generateSession;
