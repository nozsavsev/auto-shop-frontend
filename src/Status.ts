import { Fetcher } from "./Fetcher";
import { getApiUrl } from "./types";

export default class StatusAPI {
  private static async getBasePath() {
    const apiUrl = await getApiUrl();
    return `${apiUrl}/status`;
  }

  public static async isAlive(): Promise<boolean> {
    const isAlive = await Fetcher<any>(await this.getBasePath());
    return !isAlive.error;
  }
}
