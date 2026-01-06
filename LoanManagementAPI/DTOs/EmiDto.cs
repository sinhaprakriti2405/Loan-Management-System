namespace LoanManagementAPI.DTOs
{
    public class EmiDto
    {
        public int EMIId { get; set; }

        public int InstallmentNumber { get; set; }
        public DateOnly DueDate { get; set; }
        public decimal Amount { get; set; }
        public bool PaidStatus { get; set; }
    }
}
