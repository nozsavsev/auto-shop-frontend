import * as AutoShopApi from '../AutoShopApi';
import { ExecuteApiRequest, GetSSRDefaultConfig, SSRConfigParameters } from '../ApiComposer';

export class CarsSSRApi {
  private getCurrentApi(config: SSRConfigParameters) {
    return new AutoShopApi.CarsApi(GetSSRDefaultConfig(config));
  }

  public async GetCars(params: AutoShopApi.ApiCarsGetRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiCarsGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async GetCarById(params: AutoShopApi.ApiCarsIdGetRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiCarsIdGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async CreateCar(params: AutoShopApi.ApiCarsPostRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiCarsPost;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async UpdateCar(params: AutoShopApi.ApiCarsIdPutRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiCarsIdPut;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async DeleteCar(params: AutoShopApi.ApiCarsIdDeleteRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiCarsIdDelete;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }

  public async SearchCars(params: AutoShopApi.ApiCarsSearchGetRequest & SSRConfigParameters) {
    const api = this.getCurrentApi(params);
    const method = api.apiCarsSearchGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), { ...params });
  }
} 