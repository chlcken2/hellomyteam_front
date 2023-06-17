import { useMutation, useQueryClient } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { instance } from "config";
import { USER_INFO_QUERY_KEY } from "./getTeamInfo";

const fetcher = (formData: FormData) =>
  instance
    .post<ApiResponseType<string>>(`/api/team`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(({ data }) => data);

/**
 * 팀 생성하기
 * @param onSuccess: API Rsponse의 Cache를 초기화
 */
export const teamCreateQuery = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    // mutate 요청이 성공한 후 queryClient.invalidateQueries 함수를 통해
    // boardReadQuery에서 불러온 API Response의 Cache를 초기화
    onSuccess: () => queryClient.invalidateQueries(USER_INFO_QUERY_KEY),
  });
};
