import ServiceApi from "#api/ServiceApi";
import api_addresses from "#api/api_addresses";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Planet } from "./types";

type getByIdFetch = {
  id:number;
}

export const postCallListFetch = createAsyncThunk<Planet, getByIdFetch>(
  '/CallListFetch/fetch',
  async ({
    id
  }) => {
    return await ServiceApi.postCallList( 
      api_addresses.skilla_call_list
    );
  }
);