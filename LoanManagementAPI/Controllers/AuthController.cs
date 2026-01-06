using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using LoanManagementAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LoanManagementAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public AuthController(
            UserManager<ApplicationUser> userManager, AppDbContext context,
            IConfiguration configuration, INotificationService notificationService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _notificationService = notificationService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {

            var userExists = await _userManager.FindByEmailAsync(dto.Email);
            if (userExists != null)
                return BadRequest("User already exists");

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                RequestedRole = dto.RequestedRole,
                IsRoleApproved = false
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);


            await _userManager.AddToRoleAsync(user, "Customer");

            if (dto.RequestedRole != "Customer")
            {
                await _notificationService.CreateAsync(
                    null,
                    "Admin",
                    "New Role Request",
                    "A new officer needs approval"
                );
            }

            _context.SaveChanges();

            return Ok(new
            {
                message = "Registered successfully. Waiting for admin approval for requested role."
            }
            );
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {

           
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!passwordValid)
                return Unauthorized("Invalid credentials");

            
            if (dto.LoginAsRole != "Customer")
            {
                if (!user.IsRoleApproved || user.RequestedRole != dto.LoginAsRole)
                {
                    return Unauthorized("Role not approved by admin");
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains(dto.LoginAsRole))
            {
                return Unauthorized("You are not authorized for this role");
            }

            
            bool isProfileComplete = _context.Customers
                .Any(c => c.UserId == user.Id);

            var token = GenerateJwtToken(user, dto.LoginAsRole);

            return Ok(new AuthResponseDto
            {
                Token = token,
                Role = dto.LoginAsRole,
                IsProfileComplete = isProfileComplete
            });
        }



        private string GenerateJwtToken(ApplicationUser user, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: new SigningCredentials(
                    key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

