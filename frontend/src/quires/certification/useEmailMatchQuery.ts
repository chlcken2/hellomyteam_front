import { instance } from "config";
import { useQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";

export const QUERY_KEY = "/auth/match";

interface APIDataType {
  status: string;
  data: string;
  message: null | string;
}

const EmailMatchFacher = (machingNumber: number) => {
  if (!machingNumber) return null;
  return instance.get<ApiResponseType<APIDataType>>(
    `/api/auth/match?num=${machingNumber}`,
  );
};
const useEmailMatchQuery = (machingNumber: number) => {
  return useQuery(QUERY_KEY, () => EmailMatchFacher(machingNumber));
};

export default useEmailMatchQuery;
