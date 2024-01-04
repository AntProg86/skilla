import ServiceApi from "#api/ServiceApi";
import api_addresses from "#api/api_addresses";
import { createAsyncThunk } from "@reduxjs/toolkit";

type Token = {
  accessToken: string;
}

//получить Cписок продавцов
export const getCurrencyRateFetch = createAsyncThunk<any, any>(
  '/ProviderListFetchFetch/fetch',
  async ({
  }) => {
    return await ServiceApi.getCurrencyRate( 
      api_addresses.currency_rate_daily_as_json,
    );
  }
);

export const getPlanetFetch = createAsyncThunk<any, any>(
  '/PlanetListFetch/fetch',
  async ({
  }) => {
    return await ServiceApi.getPlanet( 
      api_addresses.star_wars_planets,
    );
  }
);