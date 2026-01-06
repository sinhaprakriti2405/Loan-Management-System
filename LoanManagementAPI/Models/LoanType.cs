using System.ComponentModel.DataAnnotations;

namespace LoanManagementAPI.Models
{
    public class LoanType
    {
        [Key]
        public int LoanTypeId { get; set; }
        public string Name { get; set; }
        public decimal InterestRate { get; set; }
        public int MaxTenure { get; set; }
        public decimal MinAmount { get; set; }
        public decimal MaxAmount { get; set; }

        public ICollection<LoanApplication> LoanApplications { get; set; }
    }
}
