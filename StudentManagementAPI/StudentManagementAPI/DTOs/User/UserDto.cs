﻿namespace StudentManagementAPI.DTOs.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty; 
        public string Role { get; set; } = string.Empty;

        
        
    }
}
