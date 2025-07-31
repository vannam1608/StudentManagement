﻿// DTOs/Auth/LoginRequest.cs
namespace StudentManagementAPI.DTOs.Auth
{
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
