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
const getMemberInfo = () => {
  return useQuery(QUERY_KEY, fetcher);
};

export default getMemberInfo;
