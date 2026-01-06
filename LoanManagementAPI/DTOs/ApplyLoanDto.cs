namespace LoanManagementAPI.DTOs
{
    public class ApplyLoanDto
    {
        public int LoanTypeId { get; set; }
        public decimal Amount { get; set; }
        public int Tenure { get; set; }
        public decimal AnnualIncome { get; set; }
    }
}
