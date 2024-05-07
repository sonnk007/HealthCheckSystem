namespace HCS.Business.Pagination;

public static class PaginationExtensions
{
    public static PaginationResult<T> Paginate<T>(this IEnumerable<T> source, int pageNumber, int pageSize)
    {
        var totalCount = source.Count();
        var pageData = source.Skip((pageNumber - 1)*pageSize).Take(pageSize).ToList();

        return new PaginationResult<T>()
        {
            Items = pageData,
            TotalCount = totalCount
        };
    }
}