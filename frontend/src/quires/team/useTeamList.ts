import { instance } from "config";
import { useInfiniteQuery } from "react-query";
import ApiResponseType from "types/ApiResponseType";
import { TeamCardContentsType } from "types/teamCardType";

export const QUERY_KEY = "/team";

export interface TeamListType {
  content: TeamCardContentsType[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}

const getPageParam = (currentPage: number, totalPage: number) => {
  if (totalPage === 1 && currentPage === 0) return undefined;
  if (totalPage <= currentPage + 1) return undefined;

  return currentPage + 1;
};

const TeamListFetcher = (
  memberId: number,
  pageNum: number,
  pageSize: number,
  pageSort: "SHUFFLE" | "ASC" | "DESC",
) => {
  return instance.get<ApiResponseType<TeamListType>>(
    `/api/teams?pageNum=${pageNum}&memberId=${memberId}&pageSize=${pageSize}&pageSort=${pageSort}`,
  );
};

const useInfiniteTeamListQuery = (memberId: number) => {
  return useInfiniteQuery(
    [QUERY_KEY, "list"],
    ({ pageParam = 0 }) => TeamListFetcher(memberId, pageParam, 40, "SHUFFLE"),
    {
      getNextPageParam: ({
        data: {
          data: { pageable, totalPages },
        },
      }) => {
        return getPageParam(pageable.pageNumber, totalPages);
      },
    },
  );
};

export default useInfiniteTeamListQuery;
