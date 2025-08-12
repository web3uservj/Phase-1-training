using Microsoft.AspNetCore.Mvc;
using MiniProject2.Context;
using MiniProject2.Models;

namespace MiniProject2.Controllers
{
    public class BookTicketController : Controller
    {
        public AppDbContext context { get; set; }
        public BookTicketController(AppDbContext context)
        {
            this.context= context;
        }

        public IActionResult Index()
        {
            string gender = TempData["Gender"] as string;
            List<Audience> allAudience;

            if (!string.IsNullOrEmpty(gender))
            {
                allAudience = context.audiences.Where(a => a.Gender == gender).ToList();
            }
            else
            {
                allAudience = context.audiences.ToList();
            }

            var totalAudience = allAudience.Count();
            var averageAge = Math.Round(allAudience.Average(a => a.Age), 2);

            ViewBag.TotalAudience = totalAudience;
            ViewBag.AverageAge = averageAge;

            return View(allAudience);
        }

        public IActionResult BookTicket()
        {
            return View();
        }
        public IActionResult Ticket(Audience audience)
        {
            if (ModelState.IsValid)
            {
                context.audiences.Add(audience);
                context.SaveChanges();
                return RedirectToAction("Index");
            }
            else
            {
                return RedirectToAction("BookTicket");
            }
        }
        public IActionResult Delete(string name)
        {
            var audience = context.audiences.FirstOrDefault(a => a.Name == name);
            context.audiences.Remove(audience);
            context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult FilterByGender(string gender)
        {
            var audiences = context.audiences.Where(a => a.Gender == gender).ToList();
            TempData["Gender"] = gender; 
            return RedirectToAction("Index");
        }
        public IActionResult Details(string name)
        {
            var audience=context.audiences.FirstOrDefault(a => a.Name==name);
            return View(audience);
        }
    }
}
