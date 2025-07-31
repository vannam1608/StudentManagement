﻿// DTOs/Auth/AuthResponse.cs
namespace StudentManagementAPI.DTOs.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }
}
