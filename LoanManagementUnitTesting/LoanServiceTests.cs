using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using LoanManagementAPI.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace LoanManagementAPI.Tests
{
    public class LoanServiceTests
    {
        private LoanService CreateService(out AppDbContext context)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            context = new AppDbContext(options);

            var user = new ApplicationUser
            {
                Id = "user-1",
                UserName = "testuser",
                Email = "test@test.com",
                
            };
            context.Users.Add(user);


            context.Customers.Add(new Customer
            {
                CustomerId = 1,
                UserId = "user-1",
                FullName = "Test Customer",     // ? REQUIRED
                Address = "Test Address",       // ? REQUIRED
                AnnualIncome = 600000
            });


            context.LoanTypes.Add(new LoanType
            {
                LoanTypeId = 1,
                Name = "Home Loan",
                InterestRate = 8,
                MaxTenure = 240,
                MinAmount = 100000,
                MaxAmount = 5000000
            });

            context.SaveChanges();

            return new LoanService(context);
        }

        [Fact]
        public void ApplyLoan_ValidRequest_ShouldCreateLoan()
        {
            var service = CreateService(out var context);

            var dto = new ApplyLoanDto
            {
                LoanTypeId = 1,
                Amount = 200000,
                Tenure = 24,

            };

            var result = service.ApplyLoan("user-1", dto);

            Assert.NotNull(result);
            Assert.Equal("Applied", result.Status);
            Assert.Single(context.LoanApplications);
        }

        [Fact]
        public void GetCustomerLoans_ShouldReturnLoans()
        {
            var service = CreateService(out _);

            service.ApplyLoan("user-1", new ApplyLoanDto
            {
                LoanTypeId = 1,
                Amount = 300000,
                Tenure = 36
            });

            var loans = service.GetCustomerLoans("user-1");

            Assert.Single(loans);
        }

        [Fact]
        public void ProcessLoan_Approve_ShouldGenerateEmis()
        {
            var service = CreateService(out var context);

            var loan = service.ApplyLoan("user-1", new ApplyLoanDto
            {
                LoanTypeId = 1,
                Amount = 120000,
                Tenure = 12
            });

            var emis = service.ProcessLoan(loan.LoanId, new LoanApprovalDto
            {
                IsApproved = true
            });

            Assert.Equal(12, emis.Count());
            Assert.Equal("Approved",
                context.LoanApplications.First().Status);
        }

        [Fact]
        public void ProcessLoan_Reject_ShouldNotGenerateEmis()
        {
            var service = CreateService(out var context);

            var loan = service.ApplyLoan("user-1", new ApplyLoanDto
            {
                LoanTypeId = 1,
                Amount = 150000,
                Tenure = 12
            });

            var emis = service.ProcessLoan(loan.LoanId, new LoanApprovalDto
            {
                IsApproved = false,
                Status = "Rejected",
                Remarks = "Low credit score"
            });

            Assert.Empty(emis);
            Assert.Equal("Rejected",
                context.LoanApplications.First().Status);
        }

        [Fact]
        public void GetLoanSummary_ShouldReturnCorrectCounts()
        {
            var service = CreateService(out _);

            service.ApplyLoan("user-1", new ApplyLoanDto
            {
                LoanTypeId = 1,
                Amount = 100000,
                Tenure = 12
            });

            var summary = service.GetLoanSummary();

            Assert.Equal(1, summary.TotalLoans);
            Assert.Equal(1, summary.PendingLoans);
        }
    }
}
