import * as AutoShopApi from '../AutoShopApi';
import { ExecuteApiRequest, GetSSRDefaultConfig, SSRConfigParameters } from '../ApiComposer';

export class StatusSSRApi {
  private getCurrentApi(config: SSRConfigParameters) {
    return new AutoShopApi.StatusApi(GetSSRDefaultConfig(config));
  }

  public async GetStatus(params: SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiStatusGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api));
  }
} 