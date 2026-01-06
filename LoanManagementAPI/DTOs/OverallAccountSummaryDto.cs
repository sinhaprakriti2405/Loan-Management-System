namespace LoanManagementAPI.DTOs
{
    public class OverallAccountSummaryDto
    {
        public int TotalLoans { get; set; }
        public decimal TotalLoanAmount { get; set; }
        public decimal TotalOutstandingAmount { get; set; }
        public int ActiveLoans { get; set; }
        public int ClosedLoans { get; set; }
    }
}
