import * as AutoShopApi from '../AutoShopApi';
import { ExecuteApiRequest, GetDefaultConfig } from '../ApiComposer';

export class CarsApi {
  private getCurrentApi() {
    return new AutoShopApi.CarsApi(GetDefaultConfig());
  }

  public async GetCarById(params: AutoShopApi.ApiCarsIdGetRequest) {
    const api = this.getCurrentApi();
    const method = api.apiCarsIdGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), {...params});
  }

  public async CreateCar(params: AutoShopApi.ApiCarsPostRequest = {}) {
    const api = this.getCurrentApi();
    const method = api.apiCarsPost;
    return await ExecuteApiRequest<typeof method>(method.bind(api), {...params});
  }

  public async UpdateCar(params: AutoShopApi.ApiCarsIdPutRequest) {
    const api = this.getCurrentApi();
    const method = api.apiCarsIdPut;
    return await ExecuteApiRequest<typeof method>(method.bind(api), {...params});
  }

  public async DeleteCar(params: AutoShopApi.ApiCarsIdDeleteRequest) {
    const api = this.getCurrentApi();
    const method = api.apiCarsIdDelete;
    return await ExecuteApiRequest<typeof method>(method.bind(api), {...params});
  }

  public async SearchCars(params: AutoShopApi.ApiCarsSearchGetRequest = {}) {
    const api = this.getCurrentApi();
    const method = api.apiCarsSearchGet;
    return await ExecuteApiRequest<typeof method>(method.bind(api), {...params});
  }
} 