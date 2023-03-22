import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { userTypes } from "types/UserTypes";
import { instance } from "config";

export const QUERY_KEY = "/user/me";

const fetcher = () =>
  instance.get<ApiResponseType<userTypes>>("/api/user/me").then(({ data }) => data);

/**
 * 유저의 인포(user/me)
 * @returns
 */
const getMemberInfo = (user: boolean) => {
  // 유저정보를 동기적으로 불러온다. enable로
  return useQuery(QUERY_KEY, fetcher, { enabled: user });
};

export default getMemberInfo;
