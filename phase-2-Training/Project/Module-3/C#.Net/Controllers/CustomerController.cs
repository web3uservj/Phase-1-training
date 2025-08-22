using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Miniproject.Context;
using Miniproject.Models;
using System.Linq;

namespace Miniproject.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext context;

        public CustomerController(AppDbContext context)
        {
            this.context = context;
        }

        [HttpPost("add")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddCustomer([FromBody] CustomerCreateDto customerDto)
        {
            var customer = new Customer
            {
                Name = customerDto.Name,
                Age = customerDto.Age
            };

            context.Customers.Add(customer);
            context.SaveChanges();

            return Ok(new { message = "Customer added successfully", customer });
        }


        [HttpGet("all")]
        public IActionResult GetAllCustomers()
        {
            var allCustomers = context.Customers.ToList();
            return Ok(allCustomers);
        }


        [HttpGet("{id}")]
        public IActionResult GetCustomerById(int id)
        {
            var customer = context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
            {
                return NotFound(new { message = $"Customer with ID {id} not found" });
            }
            return Ok(customer);
        }

       
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("Customer API is running.");
        }
    }
}
