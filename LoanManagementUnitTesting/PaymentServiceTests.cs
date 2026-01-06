using LoanManagementAPI.Data;
using LoanManagementAPI.Models;
using LoanManagementAPI.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace LoanManagementAPI.Tests
{
    public class PaymentServiceTests
    {
        private PaymentService CreateService(out AppDbContext context)
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            context = new AppDbContext(options);

       
            var user = new ApplicationUser
            {
                Id = "user-1",
                UserName = "customer",
                Email = "customer@test.com"
            };
            context.Users.Add(user);

            var customer = new Customer
            {
                CustomerId = 1,
                UserId = "user-1",
                FullName = "Test Customer",     // ✅ REQUIRED
                Address = "Test Address",       // ✅ REQUIRED
                AnnualIncome = 500000
            };
            context.Customers.Add(customer);

          
            var loan = new LoanApplication
            {
                LoanId = 1,
                CustomerId = 1,
                Amount = 120000,
                OutstandingAmount = 20000,
                Status = "Approved",
                AppliedDate = DateOnly.FromDateTime(DateTime.Now)
            };
            context.LoanApplications.Add(loan);

          
            context.EMIs.AddRange(
                new EMI
                {
                    EMIId = 1,
                    LoanId = 1,
                    InstallmentNumber = 1,
                    Amount = 10000,
                    PaidStatus = false
                },
                new EMI
                {
                    EMIId = 2,
                    LoanId = 1,
                    InstallmentNumber = 2,
                    Amount = 10000,
                    PaidStatus = false
                }
            );

            context.SaveChanges();

            return new PaymentService(context);
        }

        [Fact]
        public void PayEmi_ValidRequest_ShouldMarkEmiPaid()
        {
            var service = CreateService(out var context);

            service.PayEmi("user-1", 1, 1);

            var emi = context.EMIs.First(e => e.InstallmentNumber == 1);
            var loan = context.LoanApplications.First();

            Assert.True(emi.PaidStatus);
            Assert.Equal(10000, loan.OutstandingAmount);
        }

        [Fact]
        public void PayEmi_LastEmi_ShouldCloseLoan()
        {
            var service = CreateService(out var context);

            // Pay both EMIs
            service.PayEmi("user-1", 1, 1);
            service.PayEmi("user-1", 1, 2);

            var loan = context.LoanApplications.First();

            Assert.Equal(0, loan.OutstandingAmount);
            Assert.Equal("Closed", loan.Status);
        }

        [Fact]
        public void PayEmi_AlreadyPaid_ShouldThrow()
        {
            var service = CreateService(out _);

            service.PayEmi("user-1", 1, 1);

            Assert.Throws<Exception>(() =>
                service.PayEmi("user-1", 1, 1));
        }

        [Fact]
        public void CloseLoan_ShouldMarkAllEmisPaid()
        {
            var service = CreateService(out var context);

            service.CloseLoan("user-1", 1);

            Assert.All(context.EMIs, e => Assert.True(e.PaidStatus));

            var loan = context.LoanApplications.First();
            Assert.Equal("Closed", loan.Status);
            Assert.Equal(0, loan.OutstandingAmount);
        }

        [Fact]
        public void CloseLoan_UnauthorizedUser_ShouldThrow()
        {
            var service = CreateService(out _);

            Assert.Throws<Exception>(() =>
                service.CloseLoan("other-user", 1));
        }
    }
}
