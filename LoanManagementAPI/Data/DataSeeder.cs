using Microsoft.AspNetCore.Identity;
using LoanManagementAPI.Models;


namespace LoanManagementAPI.Data
{
    public class DataSeeder
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly AppDbContext _context;

        public DataSeeder(IServiceProvider serviceProvider, AppDbContext context)
        {
            _serviceProvider = serviceProvider;
            _context = context;
        }

        public async Task SeedAsync()
        {
            
            _context.Database.EnsureCreated();

            var userManager = _serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = _serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            
            string[] roles = { "Admin", "LoanOfficer", "Customer" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            await EnsureUserExists(
                userManager,
                email: "admin@loanmanagement.com",
                password: "Admin@123",
                role: "Admin"
            );

            await EnsureUserExists(
                userManager,
                email: "officer@loanmanagement.com",
                password: "Officer@123",
                role: "LoanOfficer"
            );


            await EnsureUserExists(
                userManager,
                email: "customer@loanmanagement.com",
                password: "Customer@123",
                role: "Customer"
            );
        }

        private async Task EnsureUserExists(
            UserManager<ApplicationUser> userManager,
            string email,
            string password,
            string role)
        {
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    UserName = email,
                    Email = email,
                    RequestedRole = role,
                    IsRoleApproved = true

                };

                var result = await userManager.CreateAsync(user, password);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
            else
            {
                if (!await userManager.IsInRoleAsync(user, role))
                {
                    await userManager.AddToRoleAsync(user, role);
                }

                if (!user.IsRoleApproved)
                {
                    user.IsRoleApproved = true;
                    await userManager.UpdateAsync(user);
                }
            }
        }
    }
}
