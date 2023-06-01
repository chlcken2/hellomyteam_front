import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/auth/match";

interface APIDataType {
  status: string;
  data: string;
  message: null | string;
}

const EmailMatchFacher = (auth: string, machingNumber: number) => {
  if (!machingNumber) return null;
  return instance.get<ApiResponseType<APIDataType>>(
    `/api/auth/verify?auth=${auth}&authNumber=${machingNumber}`,
  );
};
const useEmailMatchQuery = (auth: string, machingNumber: number) => {
  return useQuery(QUERY_KEY, () => EmailMatchFacher(auth, machingNumber));
};

export default useEmailMatchQuery;
