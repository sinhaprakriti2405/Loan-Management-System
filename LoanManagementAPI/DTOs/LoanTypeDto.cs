namespace LoanManagementAPI.DTOs
{
    public class LoanTypeDto
    {
        public int LoanTypeId { get; set; }
        public string Name { get; set; }
        public decimal InterestRate { get; set; }
        public int MaxTenure { get; set; }
        public decimal MinAmount { get; set; }
        public decimal MaxAmount { get; set; }
    }
}
