import * as AutoShopApi from '../AutoShopApi';
import { ExecuteApiRequest, GetSSRDefaultConfig, SSRConfigParameters } from '../ApiComposer';

export class UsersSSRApi {
  private getCurrentApi(config: SSRConfigParameters) {
    return new AutoShopApi.UsersApi(GetSSRDefaultConfig(config));
  }

  public async GetUserById(params: AutoShopApi.ApiUsersIdGetRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiUsersIdGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async CreateUser(
    params: (AutoShopApi.ApiUsersPostRequest & SSRConfigParameters )
  ) {
    const api = this.getCurrentApi(params);
    const method = api.apiUsersPost;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async UpdateUser(
    params: (AutoShopApi.ApiUsersIdPutRequest & SSRConfigParameters )
  ) {
    const api = this.getCurrentApi(params);
    const method = api.apiUsersIdPut;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async DeleteUser(params: AutoShopApi.ApiUsersIdDeleteRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiUsersIdDelete;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async SearchUsers(params: AutoShopApi.ApiUsersSearchGetRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiUsersSearchGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async BulkCreateUsers(params: AutoShopApi.ApiUsersBulkPostRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiUsersBulkPost;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }
} 