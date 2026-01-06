using LoanManagementAPI.DTOs;

namespace LoanManagementAPI.Services
{
    public interface IPaymentService
    {
        void PayEmi(string UserId, int loanId, int installmentNumber);
        void CloseLoan(string userId, int loanId);
    }
}
