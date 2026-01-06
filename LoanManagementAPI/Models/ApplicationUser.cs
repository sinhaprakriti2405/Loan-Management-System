using Microsoft.AspNetCore.Identity;

namespace LoanManagementAPI.Models
{
    public class ApplicationUser: IdentityUser
    {
        public string RequestedRole { get; set; } = "Customer";
        public bool IsRoleApproved { get; set; } = false;


    }
}

