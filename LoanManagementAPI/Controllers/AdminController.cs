using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using LoanManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace LoanManagementAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            AppDbContext context,
            INotificationService notificationService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _notificationService = notificationService;

        }


        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _userManager.Users
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.RequestedRole,
                    u.IsRoleApproved
                })
                .ToList();

            return Ok(users);
        }


        [HttpDelete("users/{email}")]
        public async Task<IActionResult> DeleteUser(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound();

            await _userManager.DeleteAsync(user);
            return Ok(new
            {
               message= "User deleted"
            });
        }



        [HttpPut("assign-role")]
        public async Task<IActionResult> AssignRole(
        [FromQuery] string email,
        [FromQuery] string role)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound("User not found");

            
            if (!await _roleManager.RoleExistsAsync(role))
                return BadRequest("Invalid role");

            var existingRoles = await _userManager.GetRolesAsync(user);
            if (existingRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, existingRoles);
            }

            await _userManager.AddToRoleAsync(user, role);

            user.IsRoleApproved = true;

            await _userManager.UpdateAsync(user);


      
            await _notificationService.CreateAsync(
                   user.Id,
                   null,
                   "Role Approved",
                   $"You have been assigned with role {role}"
               );

       
            _context.SaveChanges();

            return Ok(new
            {
                user.Email,
                RequestedRole = user.RequestedRole,
                AssignedRole = role,
                Approved = true
            });

            
        }



        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser(AdminCreateUserDto dto)
        {
            if (!await _roleManager.RoleExistsAsync(dto.Role))
                return BadRequest("Invalid role");

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest("User already exists");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                RequestedRole = dto.Role,
                IsRoleApproved = true
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, dto.Role);

            await _notificationService.CreateAsync(
                   user.Id,
                   null,
                   "Role Approved",
                   $"You have been assigned with role {dto.Role}"
               );


            return Ok(new
            {
                user.Email,
                Role = dto.Role
            });
            
        }



        [HttpGet("loan-types")]
        public IActionResult GetLoanTypes()
        {
            return Ok(_context.LoanTypes.ToList());
        }

        [HttpPut("loan-types/{id}")]
        public IActionResult UpdateLoanType(int id, LoanTypeDto dto)
        {
            var loanType = _context.LoanTypes.Find(id);
            if (loanType == null) return NotFound();

            loanType.InterestRate = dto.InterestRate;
            loanType.MaxTenure = dto.MaxTenure;
            loanType.MinAmount = dto.MinAmount;
            loanType.MaxAmount = dto.MaxAmount;

            _context.SaveChanges();
            return Ok(new
            {
                message = "Loan type updated"
            });
        }
    }
}
