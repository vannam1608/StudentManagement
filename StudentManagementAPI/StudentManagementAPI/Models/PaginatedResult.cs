namespace StudentManagementAPI.Models.Common
{
    public class PaginatedResult<T>
    {
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }

        public int TotalPages =>
            PageSize > 0 ? (int)Math.Ceiling((double)TotalItems / PageSize) : 0;
    }
}
