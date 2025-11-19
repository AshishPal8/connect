import axios from "axios";
import { cookies } from "next/headers";
import { baseUrl } from "..";

export async function createServerAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const serverApi = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    timeout: 10000,
  });

  return serverApi;
}
