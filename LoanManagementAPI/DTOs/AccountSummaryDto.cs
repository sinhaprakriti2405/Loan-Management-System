namespace LoanManagementAPI.DTOs
{
    public class AccountSummaryDto
    {
        public decimal TotalLoanAmount { get; set; }
        public decimal OutstandingAmount { get; set; }
        public int PaidEmis { get; set; }
        public int PendingEmis { get; set; }

        public string Status { get; set; }
        public string? Remarks { get; set; }
    }
}
