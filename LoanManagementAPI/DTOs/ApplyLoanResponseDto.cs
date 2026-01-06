namespace LoanManagementAPI.DTOs
{
    public class ApplyLoanResponseDto
    {
        public int LoanId { get; set; }
        public decimal Amount { get; set; }
        public int Tenure { get; set; }
        public string Status { get; set; }
        public DateOnly AppliedDate { get; set; }
    }
}
