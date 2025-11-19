import { User } from "@/types/user";
import { handleError } from "../handleError";
import api from "../axios/client";
import { createServerAxios } from "../axios/server";

export async function getUserProfile(
  username: string,
  isServer: boolean
): Promise<User | null> {
  try {
    let res;

    if (isServer) {
      // Server-side call
      const serverApi = await createServerAxios();
      res = await serverApi.get(`/user/get/${username}`);
    } else {
      // Client-side call
      res = await api.get(`/user/get/${username}`);
    }

    const data = res.data;
    const user = data.data;
    return user;
  } catch (error) {
    console.log("Error", error);
    return null;
  }
}
