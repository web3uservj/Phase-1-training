using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Miniproject.Context;
using Miniproject.Models;
using System;
using System.Linq;
using System.Security.Claims;

namespace Miniproject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BankAccountController : ControllerBase
    {
        private readonly AppDbContext context;

        public BankAccountController(AppDbContext context)
        {
            this.context = context;
        }

       
        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddBankAccount([FromBody] BankAccountCreateDto dto)
        {
            var customer = context.Customers.FirstOrDefault(c => c.Id == dto.CustomerId);
            if (customer == null)
            {
                return NotFound(new { message = $"Customer with ID {dto.CustomerId} not found" });
            }

            var bankAccount = new BankAccount
            {
                AccountNumber = dto.AccountNumber,
                Amount = dto.Amount,
                CreatedAt = dto.CreatedAt,
                CustomerId = dto.CustomerId
            };

            context.BankAccounts.Add(bankAccount);
            context.SaveChanges();
            BankAccountCreateDto bankdto = new BankAccountCreateDto { AccountNumber = bankAccount.AccountNumber, Amount = bankAccount.Amount, CreatedAt = bankAccount.CreatedAt, CustomerId = bankAccount.CustomerId };

            return Ok(new { message = "Bank account added successfully", bankdto });
        }


      
        [HttpGet("all")]
        public IActionResult GetAllAccounts()
        {
            var accounts = context.BankAccounts.Include(a => a.Customer).ToList();
            return Ok(accounts);
        }

       
        [HttpGet("by-customer/{customerId}")]
        public IActionResult GetAccountsByCustomer(int customerId)
        {
            var accounts = context.BankAccounts
                                  .Where(a => a.CustomerId == customerId)
                                  .ToList();

            if (accounts == null || accounts.Count == 0)
            {
                return NotFound(new { message = $"No accounts found for customer ID {customerId}" });
            }

            return Ok(accounts);
        }


        [HttpGet("balance")]
        [Authorize]
        public IActionResult GetUserTotalBalance()
        {
            
            var username = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(username))
            {
                return Unauthorized(new { message = "Invalid user token" });
            }

          
            var customer = context.Customers.FirstOrDefault(c => c.Name == username);

            if (customer == null)
            {
                return NotFound(new { message = $"Customer '{username}' not found." });
            }

            // Calculate total balance for this customer
            var totalBalance = context.BankAccounts
                                      .Where(a => a.CustomerId == customer.Id)
                                      .Sum(a => a.Amount);

            return Ok(new
            {
                name = username,
                totalBalance
            });
        }
    
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("BankAccount API is running.");
        }
    }
}
