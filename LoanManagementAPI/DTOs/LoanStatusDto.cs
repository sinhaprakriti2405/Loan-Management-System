namespace LoanManagementAPI.DTOs
{
    public class LoanStatusDto
    {
        public int LoanId { get; set; }

        public int CustomerId { get; set; }
        public string LoanTypeName { get; set; }
        public decimal Amount { get; set; }
        public int Tenure { get; set; }
        public string Status { get; set; }
        public DateOnly AppliedDate { get; set; }
    }
}
