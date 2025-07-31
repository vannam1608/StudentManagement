namespace StudentManagementAPI.DTOs.User
{
    public class UserCredentialDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = default!;
        public string Role { get; set; } = default!;
    }
}
