using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoanManagementAPI.Models
{
    public class LoanApplication
    {
        [Key]
        public int LoanId { get; set; }
        public int CustomerId { get; set; } 
        public Customer Customer { get; set; }
        public int LoanTypeId { get; set; }
        public decimal Amount { get; set; }
        public int Tenure { get; set; }
        public decimal AnnualIncome { get; set; }
        public decimal InterestRate { get; set; }
        public string Status { get; set; } = "Applied";
        public DateOnly AppliedDate { get; set; } = DateOnly.FromDateTime(DateTime.Now);
        public LoanType LoanType { get; set; } = null!;
        public decimal OutstandingAmount { get; set; }
        public bool EmiGenerated { get; set; } = false;

        public string? Remarks { get; set; }
        public ICollection<EMI> EMIs { get; set; }

    }
}
