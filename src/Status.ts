import { Fetcher } from "./Fetcher";
import { API_URL } from "./types";


export default class StatusAPI {
  private static readonly BASE_PATH = `${API_URL}/status`;

  public static async isAlive(): Promise<boolean> {
    const isAlive = await Fetcher<any>(this.BASE_PATH);
    return !isAlive.error;
  }
}
