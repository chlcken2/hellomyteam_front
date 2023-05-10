import { AxiosResponse } from "axios";
import { useEffect } from "react";
import { InfiniteQueryObserverResult } from "react-query";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";
import ApiResponseType from "types/ApiResponseType";

type PropsType<T> = () => Promise<
  InfiniteQueryObserverResult<AxiosResponse<ApiResponseType<T>, any>, unknown>
>;

const useMemberId = <T>(fetchAPI: PropsType<T>) => {
  const userState = useRecoilValue(UserState);
  useEffect(() => {
    if (userState) {
      fetchAPI();
    }
  }, [userState]);
};

export default useMemberId;
