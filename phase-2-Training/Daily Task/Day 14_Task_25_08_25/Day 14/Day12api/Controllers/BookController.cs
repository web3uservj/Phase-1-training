using Day12api.Context;
using Day12api.Model;
using Day12api.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Day12api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet("GetAllBooks")]
        public ActionResult<IEnumerable<Book>> GetAllBooks()
        {
            return Ok(_bookService.GetAllBooks());
        }

        [HttpPost("AddBook")]
        public IActionResult AddBook(Book book)
        {
            return Ok(_bookService.AddBook(book));
        }

        [HttpDelete("DeleteBook/{id}")]
        public IActionResult DeleteBook(int id)
        {
            var result = _bookService.DeleteBook(id);
            return result == "Book deleted successfully" ? Ok(result) : NotFound(result);
        }

        [HttpPost("AddAuthor")]
        public IActionResult AddAuthor(Author author)
        {
            return Ok(_bookService.AddAuthor(author));
        }

        [HttpGet("FetchAllNewBook")]
        public IActionResult GetAllNewBooks()
        {
            return Ok(_bookService.GetAllNewBooks());
        }

        [HttpPost("AddSalesInfo")]
        public IActionResult AddSalesInfo(SalesEntry entry)
        {
            var result = _bookService.AddSalesInfo(entry);
            return result == "Sales information added successfully" ? Ok(result) : NotFound(result);
        }

        [HttpPost("AddNewBook")]
        public IActionResult AddNewBook(BookAndAuthorEntry entry)
        {
            var result = _bookService.AddNewBook(entry);
            return result == "New book added successfully" ? Ok(result) : NotFound(result);
        }
    }

}
