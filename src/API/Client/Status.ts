import * as AutoShopApi from '../AutoShopApi';
import { ExecuteApiRequest, GetDefaultConfig } from '../ApiComposer';

export class StatusApi {
  private getCurrentApi() {
    return new AutoShopApi.StatusApi(GetDefaultConfig());
  }

  public async GetStatus() {
    const api = this.getCurrentApi();
    const method = api.apiStatusGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api));
  }
} 