using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanManagementAPI.Services
{
    public class LoanService : ILoanService
    {
        private readonly AppDbContext _context;

        public LoanService(AppDbContext context)
        {
            _context = context;
        }


        public ApplyLoanResponseDto ApplyLoan(string userId, ApplyLoanDto dto)
        {
            var customer = _context.Customers
                .FirstOrDefault(c => c.UserId == userId)
                ?? throw new Exception("Please complete your profile before applying for a loan");

            
            var loanType = _context.LoanTypes.Find(dto.LoanTypeId)
                ?? throw new Exception("Invalid loan type");

            
            var loan = new LoanApplication
            {
                CustomerId = customer.CustomerId,  
                LoanTypeId = dto.LoanTypeId,
                Amount = dto.Amount,
                Tenure = dto.Tenure,
                AnnualIncome = customer.AnnualIncome,
                InterestRate = loanType.InterestRate,
                OutstandingAmount = dto.Amount,
                Status = "Applied",
                AppliedDate = DateOnly.FromDateTime(DateTime.Now)
            };

            _context.LoanApplications.Add(loan);
            _context.SaveChanges();

            
            return new ApplyLoanResponseDto
            {
                LoanId = loan.LoanId,
                Amount = loan.Amount,
                Tenure = loan.Tenure,
                Status = loan.Status,
                AppliedDate = loan.AppliedDate
            };
        }


        public IEnumerable<LoanStatusDto> GetCustomerLoans(string userId)
        {
                var customerId = _context.Customers
                .Where(c => c.UserId == userId)
                .Select(c => c.CustomerId)
                .FirstOrDefault();

            if (customerId == 0)
                throw new Exception("Customer profile not found");

            return _context.LoanApplications
                .Include(l => l.LoanType)
                .Where(l => l.CustomerId == customerId)
                .Select(l => new LoanStatusDto
                {
                    LoanId = l.LoanId,
                    LoanTypeName=l.LoanType.Name,
                    Amount = l.Amount,
                    Tenure = l.Tenure,
                    Status = l.Status,
                    AppliedDate = l.AppliedDate
                })
                .ToList();
        }


        public IEnumerable<EmiDto> GetEmis(int loanId)
        {
            return _context.EMIs
                .Where(e => e.LoanId == loanId)
                .OrderBy(e => e.InstallmentNumber)
                .Select(e => new EmiDto
                {
                    EMIId = e.EMIId,
                    InstallmentNumber = e.InstallmentNumber,
                    DueDate = e.DueDate,
                    Amount = e.Amount,
                    PaidStatus = e.PaidStatus
                })
                .ToList();
        }

        public AccountSummaryDto GetAccountSummary(int loanId)
        {
            var loan = _context.LoanApplications
                .FirstOrDefault(l => l.LoanId == loanId)
                ?? throw new Exception("Loan not found");

            var emis = _context.EMIs
                .Where(e => e.LoanId == loanId)
                .ToList();

            return new AccountSummaryDto
            {
                TotalLoanAmount = loan.Amount,
                OutstandingAmount = loan.OutstandingAmount,
                PaidEmis = emis.Count(e => e.PaidStatus),
                PendingEmis = emis.Count(e => !e.PaidStatus),         
                Status = loan.Status,
                Remarks = loan.Remarks
            };
        }



        public OverallAccountSummaryDto GetOverallAccountSummary(string userId)
        {
            
            var customerId = _context.Customers
                .Where(c => c.UserId == userId)
                .Select(c => c.CustomerId)
                .FirstOrDefault();

            if (customerId == 0)
                throw new Exception("Customer profile not found");

            
            var loans = _context.LoanApplications
                .Where(l => l.CustomerId == customerId)
                .ToList();

            return new OverallAccountSummaryDto
            {
                TotalLoans = loans.Count,
                TotalLoanAmount = loans.Sum(l => l.Amount),
                TotalOutstandingAmount = loans.Sum(l => l.OutstandingAmount),
                ActiveLoans = loans.Count(l => l.Status == "Approved"),
                ClosedLoans = loans.Count(l => l.Status == "Closed")
            };
        }




        public IEnumerable<LoanStatusDto> GetAllLoans()
        {
            return _context.LoanApplications
                .Select(l => new LoanStatusDto
                {
                    LoanId = l.LoanId,
                    CustomerId = l.CustomerId,
                    LoanTypeName = l.LoanType.Name,
                    Amount = l.Amount,
                    Tenure = l.Tenure,
                    Status = l.Status,
                    AppliedDate = l.AppliedDate
                })
                .ToList();
        }

  
        public IEnumerable<EmiDto> ProcessLoan(int loanId, LoanApprovalDto dto)
        {
            var loan = _context.LoanApplications
                .Include(l => l.EMIs)
                .FirstOrDefault(l => l.LoanId == loanId)
                ?? throw new Exception("Loan not found");

            if (!dto.IsApproved)
            {
                loan.Status = dto.Status;
                loan.Remarks = dto.Remarks;
                _context.SaveChanges();
                return Enumerable.Empty<EmiDto>();
            }

            loan.Status = "Approved";


            GenerateEmis(loan);
            _context.SaveChanges();

            return loan.EMIs.Select(e => new EmiDto
            {
                EMIId = e.EMIId,
                DueDate = e.DueDate,
                Amount = e.Amount,
                PaidStatus = e.PaidStatus
            }).ToList();
        }

        private void GenerateEmis(LoanApplication loan)
        {
            decimal r = loan.InterestRate / 12 / 100;
            int n = loan.Tenure;
            decimal p = loan.Amount;

            decimal emi =
                (p * r * (decimal)Math.Pow((double)(1 + r), n)) /
                ((decimal)Math.Pow((double)(1 + r), n) - 1);

            var startDate = DateOnly.FromDateTime(DateTime.Now);

            for (int i = 1; i <= n; i++)
            {
                _context.EMIs.Add(new EMI
                {
                    LoanId = loan.LoanId,
                    InstallmentNumber=i,
                    DueDate = startDate.AddMonths(i),
                    Amount = Math.Round(emi, 2),
                    PaidStatus = false
                });
            }
        }





        public LoanSummaryDto GetLoanSummary()
        {
            return new LoanSummaryDto
            {
                TotalLoans = _context.LoanApplications.Count(),
                ApprovedLoans = _context.LoanApplications.Count(l => l.Status == "Approved"),
                PendingLoans = _context.LoanApplications.Count(l => l.Status == "Applied"),
                RejectedLoans = _context.LoanApplications.Count(l => l.Status == "Rejected")
            };
        }
    }
}
