import * as AutoShopApi from "../AutoShopApi";
import { ExecuteApiRequest, GetDefaultConfig } from "../ApiComposer";

export class UsersApi {
  private getCurrentApi() {
    return new AutoShopApi.UsersApi(GetDefaultConfig());
  }

  public async GetUserById(params: AutoShopApi.ApiUsersIdGetRequest) {
    const api = this.getCurrentApi();
    const method = api.apiUsersIdGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async CreateUser(params: AutoShopApi.ApiUsersPostRequest = {}) {
    const api = this.getCurrentApi();
    const method = api.apiUsersPost;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async UpdateUser(params: AutoShopApi.ApiUsersIdPutRequest) {
    const api = this.getCurrentApi();
    const method = api.apiUsersIdPut;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async DeleteUser(params: AutoShopApi.ApiUsersIdDeleteRequest) {
    const api = this.getCurrentApi();
    const method = api.apiUsersIdDelete;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async SearchUsers(params: AutoShopApi.ApiUsersSearchGetRequest = {}) {
    const api = this.getCurrentApi();
    const method = api.apiUsersSearchGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }
}
