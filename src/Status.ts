import { Fetcher } from "./Fetcher";


export default class StatusAPI {
  private static readonly BASE_PATH = `${process.env.NEXT_PUBLIC_API_URL}/status`;

  public static async isAlive(): Promise<boolean> {
    const isAlive = await Fetcher<any>(this.BASE_PATH);
    return !isAlive.error;
  }
}
