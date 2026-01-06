using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LoanManagementAPI.Controllers
{
    [ApiController]
    [Route("api/customers")]
    [Authorize(Roles = "Customer")]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public IActionResult GetMyProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var customer = _context.Customers
                .Where(c => c.UserId == userId)
                .Select(c => new ProfileDto
                {
                    FullName = c.FullName,
                    AnnualIncome = c.AnnualIncome,
                    Address = c.Address
                })
                .FirstOrDefault();

            if (customer == null)
                return NotFound("Profile not found");

            return Ok(customer);
        }


        [HttpPost("me")]
        public IActionResult CreateProfile(ProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            if (_context.Customers.Any(c => c.UserId == userId))
                return BadRequest("Profile already exists");

            var customer = new Customer
            {
                UserId = userId,
                FullName = dto.FullName,
                AnnualIncome = dto.AnnualIncome,
                Address = dto.Address
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new { message = "Profile created successfully" });
        }

        [HttpPut("me")]
        public IActionResult UpdateProfile(ProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var customer = _context.Customers
                .FirstOrDefault(c => c.UserId == userId);

            if (customer == null)
                return NotFound("Profile not found");

            customer.FullName = dto.FullName;
            customer.AnnualIncome = dto.AnnualIncome;
            customer.Address = dto.Address;

            _context.SaveChanges();

            return Ok(new { message = "Profile updated successfully" });
        }
    }
}
