const NoTeamFound = ({ searchValue }: { searchValue: string }) => (
  <div className="no-team-found">
    <span>
      <span className="no-team-found-search-value">{searchValue}</span>에 대한&nbsp;
      <span className="no-team-found-mo">검색 결과가 없습니다.</span>
    </span>
  </div>
);

export default NoTeamFound;
