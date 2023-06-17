import { instance } from "config";
import { useMutation, useQueryClient } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { setToken } from "utils/setAuthorization";

export const QUERY_KEY = "/login";

interface fetcherPropsType {
  email: string;
  password: string;
}

interface APIDataType {
  accessToken: string;
  refreshToken: string;
}

const LoginFetcher = (loginRequest: fetcherPropsType) =>
  instance
    .post<ApiResponseType<APIDataType>>(`/api/auth/login`, loginRequest)
    .then((data) => {
      const { accessToken, refreshToken } = data.data.data;
      setToken(accessToken, refreshToken);
      return data;
    });

const useLoginMutation = (loginRequest: fetcherPropsType) => {
  const queryClient = useQueryClient();
  return useMutation(QUERY_KEY, () => LoginFetcher(loginRequest), {
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
  });
};

export default useLoginMutation;
