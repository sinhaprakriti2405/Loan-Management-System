using System.ComponentModel.DataAnnotations;

namespace LoanManagementAPI.Models
{
    public class EMI
    {
        [Key]
        public int EMIId { get; set; }

        public int LoanId { get; set; }

        public int InstallmentNumber { get; set; }

        public DateOnly DueDate { get; set; }

        public decimal Amount { get; set; }

        public decimal PrincipalAmount { get; set; } 
        public decimal InterestAmount { get; set; }

        public bool PaidStatus { get; set; } = false;

        public LoanApplication LoanApplication { get; set; }
    }
}
