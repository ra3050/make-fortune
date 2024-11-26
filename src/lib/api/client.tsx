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

export const axiosPostForm = async <T,>(
  uri: string,
  body?: Record<any, string>,
  contentType?: string,
  authCheck: boolean = false,
  otherAxiosConfig?: any
): Promise<AxiosResponse<T> | void | undefined> => {
  let checkTokenFlag = true;
  // if "체크토큰"
  // not if "체크토큰"  :: 에러로그 + 리턴 undifined

  if (!reqList.find((v: string): boolean => v === uri)) {
    reqList.push(uri);

    let header = {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "",
    };
    if (contentType) {
      header["Content-Type"] = contentType;
    }
    if (authCheck) {
      header["Authorization"] =
        "Bearar" + "내부저장소에 저장된 엑세스 토큰을 발급받으세요";
    }

    const axiosConfig = {
      ...otherAxiosConfig,
      headers: {
        ...header,
      },
    };

    let response = undefined;
    try {
      response = await client.post(uri, body, axiosConfig);
    } catch (e) {
      if (e instanceof AxiosError) {
        // 에러처리
      }

      console.log(uri, ":: axiosPostForm Error  :: ", e);
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
