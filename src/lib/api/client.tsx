import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { stringify } from "querystring";

const client: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_MARKET_DATA_BASE_URL,
});

client.defaults.timeout = 60000;

let reqList: string[] = [];

export const axiosGetForm = async <T,>(
  uri: string,
  body?: Record<string, any> // body는 객체로 제한
): Promise<AxiosResponse<T> | void | undefined> => {
  if (!reqList.find((v: string): boolean => v === uri)) {
    reqList.push(uri);

    let response = undefined;
    try {
      response = await axios.get(uri);
    } catch (e) {
      if (e instanceof AxiosError) {
        // 내용없음
      }

      console.log(uri, ":: axiosGerForm Error  :: ", e);
    } finally {
      reqList = reqList.filter((v: string) => {
        return v != uri;
      });
    }
    return response;
  }
};

// AxiosPostForm :: header값을 수동으로 config: 'application/json'을 작성해서 넣어줄 수 있도록 합니다.

// 2024.11.19 :: Promise<AxiosResponse<T>> 여기에 적용하고 사용할 수 있을까?
const defaultData = {
  code: "F000",
  msg: "예상치 못한 에러",
  result: null,
};
