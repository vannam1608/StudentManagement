namespace StudentManagementAPI.DTOs.Common
{
    public class PaginationQueryDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
