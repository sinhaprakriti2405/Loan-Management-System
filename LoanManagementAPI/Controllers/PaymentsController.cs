using LoanManagementAPI.Data;
using LoanManagementAPI.DTOs;
using LoanManagementAPI.Models;
using LoanManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LoanManagementAPI.Controllers
{
    [Authorize(Roles = "Customer")]
    [ApiController]
    [Route("api/payments")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;


        public PaymentsController(IPaymentService paymentService, INotificationService notificationService,AppDbContext context)
        {
            _paymentService = paymentService;
            _notificationService = notificationService;
            _context = context;
        }

        [HttpPost("pay-emi")]
        public async Task<IActionResult> PayEmi(PayEmiDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            _paymentService.PayEmi(
                userId,
                dto.LoanId,
                dto.InstallmentNumber
            );

            var loan = await _context.LoanApplications
                .Include(l => l.Customer)
                .FirstOrDefaultAsync(l => l.LoanId == dto.LoanId);

            if (loan == null)
                return NotFound("Loan not found");

            await _notificationService.CreateAsync(
                loan.Customer.UserId,
                null,
                "EMI Paid Successfully",
                $"Your EMI (Loan ID: {dto.LoanId}, Installment: {dto.InstallmentNumber}) has been paid."
              );

           
            await _notificationService.CreateAsync(
                null,
                "LoanOfficer",
                "EMI Payment Received",
                $"EMI paid for Loan ID {dto.LoanId}, Installment {dto.InstallmentNumber}."
            );

            _context.SaveChanges();

            return Ok(new
            {
                message = "EMI payment successful"
            });
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("close-loan/{loanId}")]
        public async Task<IActionResult> CloseLoan(int loanId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            _paymentService.CloseLoan(userId, loanId);

            var loan = await _context.LoanApplications
            .Include(l => l.Customer)
            .FirstOrDefaultAsync(l => l.LoanId == loanId);

            if (loan == null)
                return NotFound("Loan not found");

            
            await _notificationService.CreateAsync(
                loan.Customer.UserId,
                null,
                "Loan Closed",
                $"Your loan (Loan ID: {loanId}) has been successfully closed."
            );

           
            await _notificationService.CreateAsync(
                null,
                "LoanOfficer",
                "Loan Closed",
                $"Loan ID {loanId} has been fully repaid and closed."
            );

            _context.SaveChanges();

            return Ok(new
            {
                message = "Loan closed successfully"
            });
        }
    }
}
