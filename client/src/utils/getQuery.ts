export default function getQuery(bigQuery: string): object {
  if (bigQuery) {
    const queryString = bigQuery.split("?")[1];
    if (queryString.length > 0) {
      const queries = queryString.split("&");
      const queriesObj: any = {};
      queries.forEach((query: any) => {
        const keyValue: string[] = query.split("=");
        queriesObj[keyValue[0]] = keyValue[1];
      });

      return queriesObj;
    }
  }

  return {};
}
