using LoanManagementAPI.DTOs;

namespace LoanManagementAPI.Services
{
    public interface ILoanService
    {

        ApplyLoanResponseDto ApplyLoan(string userId, ApplyLoanDto dto);
        IEnumerable<LoanStatusDto> GetCustomerLoans(string userId);
        IEnumerable<EmiDto> GetEmis(int loanId);
        AccountSummaryDto GetAccountSummary(int loanId);
        OverallAccountSummaryDto GetOverallAccountSummary(string userId);


        IEnumerable<LoanStatusDto> GetAllLoans();
        IEnumerable<EmiDto> ProcessLoan(int loanId, LoanApprovalDto dto);
        
        LoanSummaryDto GetLoanSummary();
    }
}
