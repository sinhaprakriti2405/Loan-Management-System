using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using LoanManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;


namespace LoanManagementAPI.Controllers
{
    [ApiController]
    [Route("api/loans")]
    public class LoansController : ControllerBase
    {
        private readonly ILoanService _loanService;
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public LoansController(ILoanService loanService, AppDbContext context, INotificationService notificationService)
        {
            _loanService = loanService;
            _context = context;
            _notificationService = notificationService;
        }


        [Authorize(Roles = "Customer")]
        [HttpGet("seeloantypes")]
        public IActionResult GetLoanTypesForCustomers()
        {
            var loanTypes = _context.LoanTypes
                .Select(l => new
                {
                    l.LoanTypeId,
                    l.Name,
                    l.InterestRate,
                    l.MaxTenure,
                    l.MinAmount,
                    l.MaxAmount
                })
                .ToList();

            return Ok(loanTypes);
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("apply")]
        public async Task <IActionResult> ApplyLoan(ApplyLoanDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var response = _loanService.ApplyLoan(userId, dto);


            await _notificationService.CreateAsync(
                   null,
                   "LoanOfficer",
                   "New Loan Application",
                   $"A new loan application (Loan ID: {response.LoanId}) has been submitted."
               );

            _context.SaveChanges();

            return Ok(response);
        }


        [Authorize(Roles = "Customer")]
        [HttpGet("my-loans")]
        public IActionResult MyLoans()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Ok(_loanService.GetCustomerLoans(userId));
        }

        [Authorize(Roles = "Customer,LoanOfficer")]
        [HttpGet("emis/{loanId}")]
        public IActionResult Emis(int loanId)
        {
            return Ok(_loanService.GetEmis(loanId));
        }

        [Authorize(Roles = "Customer,LoanOfficer")]
        [HttpGet("account-summary/{loanId}")]
        public IActionResult AccountSummary(int loanId)
        {
            return Ok(_loanService.GetAccountSummary(loanId));
        }


        [Authorize(Roles = "Customer")]
        [HttpGet("account-summary")]
        public IActionResult OverallAccountSummary()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            return Ok(_loanService.GetOverallAccountSummary(userId));
        }



        [Authorize(Roles = "LoanOfficer")]
        [HttpGet("applications")]
        public IActionResult Applications()
        {
            return Ok(_loanService.GetAllLoans());
        }

        [Authorize(Roles = "LoanOfficer")]
        [HttpPut("process/{loanId}")]
        public async Task <IActionResult> ProcessLoan(int loanId,[FromBody] LoanApprovalDto dto)
        {
            var emis = _loanService.ProcessLoan(loanId, dto);

            var loan = _context.LoanApplications
               .Include(l => l.Customer)
               .FirstOrDefault(l => l.LoanId == loanId);

            if (!dto.IsApproved)
            {
                await _notificationService.CreateAsync(
                     loan.Customer.UserId,     // specific customer
                     null,
                     "Loan Rejected",
                     $"Your loan application (Loan ID: {loanId}) has been rejected."
                 );

                return Ok(new { Message = "Loan rejected" });
            }


            await _notificationService.CreateAsync(
                loan.Customer.UserId,
                null,
                "Loan Approved",
                $"Your loan #{loan.LoanId} has been approved"
            );

            _context.SaveChanges();

            return Ok(new
            {
                Message = "Loan approved and EMI schedule generated",
                EmiSchedule = emis
            });
        }


        [Authorize(Roles = "LoanOfficer")]
        [HttpGet("details/{loanId}")]
        public IActionResult GetLoanDetails(int loanId)
        {
            var loan = _context.LoanApplications
                .Where(l => l.LoanId == loanId)
                .Select(l => new
                {
                    l.LoanId,
                    l.Status,
                    l.Amount,
                    l.Tenure,
                    l.InterestRate,
                    l.AnnualIncome,
                    l.AppliedDate,

                    CustomerId = l.Customer.CustomerId,
                    CustomerName = l.Customer.FullName,

                    LoanTypeName = l.LoanType.Name
                })
                .FirstOrDefault();

            if (loan == null)
                return NotFound("Loan not found");

            return Ok(loan);
        }


    }
}
