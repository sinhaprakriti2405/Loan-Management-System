namespace LoanManagementAPI.DTOs
{
    public class LoanSummaryDto
    {
        public int TotalLoans { get; set; }
        public int ApprovedLoans { get; set; }
        public int PendingLoans { get; set; }
        public int RejectedLoans { get; set; }
    }
}
