﻿namespace StudentManagementAPI.DTOs.User
{
    public class UpdateUserDto
    {
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}
