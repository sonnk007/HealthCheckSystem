namespace HCS.Business.Pagination;

public class PaginationResult<T>
{
    public IEnumerable<T> Items { get; set; }
    public int TotalCount { get; set; }
    
}
