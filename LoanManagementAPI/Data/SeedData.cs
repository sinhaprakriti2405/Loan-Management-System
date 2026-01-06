using LoanManagementAPI.Models;

namespace LoanManagementAPI.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
        
            if (context.LoanTypes.Any())
            {
                return;
            }

            
            var loanTypes = new[]
            {
                new LoanType
                {
                    Name = "Personal Loan",
                    InterestRate = 10.5m,
                    MaxTenure = 36,
                    MinAmount = 50000,
                    MaxAmount = 500000
                },
                new LoanType
                {
                    Name = "Home Loan",
                    InterestRate = 8.5m,
                    MaxTenure = 240,
                    MinAmount = 500000,
                    MaxAmount = 5000000
                },
                new LoanType
                {
                    Name = "Vehicle Loan",
                    InterestRate = 9.25m,
                    MaxTenure = 60,
                    MinAmount = 100000,
                    MaxAmount = 1500000
                },
                new LoanType
                {
                    Name = "Education Loan",
                    InterestRate = 7.5m,
                    MaxTenure = 120,
                    MinAmount = 100000,
                    MaxAmount = 3000000
                }
            };

            context.LoanTypes.AddRange(loanTypes);

            context.SaveChanges();
        }
    }
}

