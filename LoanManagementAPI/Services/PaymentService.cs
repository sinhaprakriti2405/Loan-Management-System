using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LoanManagementAPI.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        public void PayEmi(string userId, int loanId, int installmentNumber)
        {
          
            var customerId = _context.Customers
                .Where(c => c.UserId == userId)
                .Select(c => c.CustomerId)
                .FirstOrDefault();

            if (customerId == 0)
                throw new Exception("Customer profile not found");

         
            var loan = _context.LoanApplications
                .FirstOrDefault(l => l.LoanId == loanId && l.CustomerId == customerId);

            if (loan == null)
                throw new Exception("Loan not found or unauthorized");

            var emi = _context.EMIs
                .FirstOrDefault(e =>
                    e.LoanId == loanId &&
                    e.InstallmentNumber == installmentNumber);

            if (emi == null)
                throw new Exception("EMI not found");

            if (emi.PaidStatus)
                throw new Exception("EMI already paid");

          
            emi.PaidStatus = true;
            loan.OutstandingAmount -= emi.Amount;

          
            if (loan.OutstandingAmount <= 0)
            {
                loan.Status = "Closed";
            }

            _context.SaveChanges();
        }




        public void CloseLoan(string userId, int loanId)
        {
            var loan = _context.LoanApplications
                .Include(l => l.EMIs)
                .Include(l => l.Customer)
                .FirstOrDefault(l => l.LoanId == loanId);

            if (loan == null)
                throw new Exception("Loan not found");

            if (loan.Customer.UserId != userId)
                throw new Exception("Unauthorized loan access");

            if (loan.Status == "Closed")
                throw new Exception("Loan already closed");

            foreach (var emi in loan.EMIs.Where(e => !e.PaidStatus))
            {
                emi.PaidStatus = true;
            }

            loan.OutstandingAmount = 0;
            loan.Status = "Closed";

            _context.SaveChanges();
        }

    }
}
