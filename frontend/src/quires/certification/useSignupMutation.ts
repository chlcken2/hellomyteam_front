import { instance } from "config";
import { useMutation, useQueryClient } from "react-query";
import ApiResponseType from "types/ApiResponseType";

interface fetcherPropsType {
  birthday: string;
  email: string;
  joinPurpose: string;
  name: string;
  password: string;
  privacyYn: string;
  termsOfServiceYn: string;
}

interface APIDataType {
  createdDate: string;
  modifiedDate: string;
  id: number;
  email: string;
  name: string;
  birthday: string;
  memberStatus: string;
  joinPurpose: string;
  termsAndCond: [{ id: number; termsOfServiceYn: string; privacyYn: string }];
}

const QUERY_KEY = "/signup";

const SignupFetcher = (signupRequest: fetcherPropsType) =>
  instance
    .post<ApiResponseType<APIDataType | null>>(`/api/auth/signup`, signupRequest)
    .then((data) => {
      const userId = data.data.data.id;
      localStorage.setItem("userId", userId.toString());
      return data;
    });

const useSignupMutation = (signupRequest: fetcherPropsType) => {
  const queryClient = useQueryClient();
  return useMutation(QUERY_KEY, () => SignupFetcher(signupRequest), {
    onSuccess: () => queryClient.invalidateQueries(QUERY_KEY),
  });
};

export default useSignupMutation;
