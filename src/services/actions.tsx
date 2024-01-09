import ServiceApi from "#api/ServiceApi";
import api_addresses from "#api/api_addresses";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Call } from "./types";

type getByIdFetch = {
  id:number;
}

export const postCallListFetch = createAsyncThunk<any, any>(
  '/CallListFetch/fetch',
  async ({
    date_start,
    date_end,
    in_out,
    sort_by
  }) => {
    return await ServiceApi.postCallList( 
      api_addresses.skilla_call_list,
      {
        date_start,
        date_end,
        in_out,
        sort_by
      }
    );
  }
);

export const postRecordFetch = createAsyncThunk<any, any>(
  '/RecordFetch/fetch',
  async ({
    record,
    partnership_id,
  }) => {
    return await ServiceApi.postRecord( 
      api_addresses.skilla_record,
      {
        record,
        partnership_id,
      }
    );
  }
);