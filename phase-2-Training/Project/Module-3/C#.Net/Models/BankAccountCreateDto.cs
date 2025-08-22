using System;

namespace Miniproject.Models
{
    public class BankAccountCreateDto
    {
        public string AccountNumber { get; set; }
        public double Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CustomerId { get; set; }
    }
}
