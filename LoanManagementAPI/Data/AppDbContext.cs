using LoanManagementAPI.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace LoanManagementAPI.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<LoanType> LoanTypes => Set<LoanType>();
        public DbSet<LoanApplication> LoanApplications => Set<LoanApplication>();
        public DbSet<EMI> EMIs => Set<EMI>();

        public DbSet<Notification> Notifications { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            var dateOnlyConverter = new ValueConverter<DateOnly, DateTime>(
                d => d.ToDateTime(TimeOnly.MinValue),
                d => DateOnly.FromDateTime(d)
            );


            builder.Entity<Customer>()
                .HasOne(c => c.User)
                .WithMany() 
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            builder.Entity<LoanApplication>()
                .HasOne(l => l.Customer)
                .WithMany(c => c.LoanApplications)
                .HasForeignKey(l => l.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<LoanApplication>()
                .HasOne(l => l.LoanType)
                .WithMany(t => t.LoanApplications)
                .HasForeignKey(l => l.LoanTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<EMI>()
                .HasOne(e => e.LoanApplication)
                .WithMany(l => l.EMIs)
                .HasForeignKey(e => e.LoanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Customer>()
                .Property(c => c.AnnualIncome)
                .HasPrecision(18, 2);

            builder.Entity<LoanApplication>()
                .Property(l => l.Amount)
                .HasPrecision(18, 2);

            builder.Entity<LoanApplication>()
                .Property(l => l.OutstandingAmount)
                .HasPrecision(18, 2);

            builder.Entity<LoanApplication>()
                .Property(l => l.AnnualIncome)
                .HasPrecision(18, 2);

            builder.Entity<LoanApplication>()
                .Property(l => l.InterestRate)
                .HasPrecision(5, 2);

            builder.Entity<EMI>()
                .Property(e => e.Amount)
                .HasPrecision(18, 2);

            builder.Entity<LoanType>()
                .Property(t => t.InterestRate)
                .HasPrecision(5, 2);

            builder.Entity<LoanType>()
                .Property(t => t.MinAmount)
                .HasPrecision(18, 2);

            builder.Entity<LoanType>()
                .Property(t => t.MaxAmount)
                .HasPrecision(18, 2);

            builder.Entity<EMI>()
                .Property(e => e.PrincipalAmount)
                .HasPrecision(18, 2);

            builder.Entity<EMI>()
                .Property(e => e.InterestAmount)
                .HasPrecision(18, 2);

            builder.Entity<Notification>()
                .Property(n => n.UserId)
                .IsRequired(false);

            builder.Entity<Notification>()
                .Property(n => n.Role)
                .IsRequired(false);

        }
    }
}
