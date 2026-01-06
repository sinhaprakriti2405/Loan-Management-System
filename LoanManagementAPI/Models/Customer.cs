namespace LoanManagementAPI.Models
{
    public class Customer
    {
        public int CustomerId { get; set; }

        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public string FullName { get; set; }
        public decimal AnnualIncome { get; set; }

        public string Address { get; set; }

        public ICollection<LoanApplication> LoanApplications { get; set; }
    }
}
