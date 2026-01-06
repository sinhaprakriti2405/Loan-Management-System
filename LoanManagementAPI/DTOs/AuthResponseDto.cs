namespace LoanManagementAPI.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public string Role { get; set; }

        public bool IsProfileComplete { get; set; } 
    }
}
