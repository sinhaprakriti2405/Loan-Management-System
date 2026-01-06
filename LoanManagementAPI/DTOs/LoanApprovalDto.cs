namespace LoanManagementAPI.DTOs
{
    public class LoanApprovalDto
    {
        public bool IsApproved { get; set; }
        public string Status { get; set; } = "";
        public string? Remarks { get; set; }
    }
}
