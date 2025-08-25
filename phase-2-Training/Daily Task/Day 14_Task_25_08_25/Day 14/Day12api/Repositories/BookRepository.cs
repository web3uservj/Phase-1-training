using Day12api.Context;
using Day12api.Model;
using Microsoft.EntityFrameworkCore;

namespace Day12api.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly MyAppDbContext _context;

        public BookRepository(MyAppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Book> GetAllBooks() => _context.Books.ToList();

        public void AddBook(Book book)
        {
            _context.Books.Add(book);
            _context.SaveChanges();
        }

        public bool DeleteBook(int id)
        {
            var book = _context.Books.Find(id);
            if (book == null) return false;

            _context.Books.Remove(book);
            _context.SaveChanges();
            return true;
        }

        public void AddAuthor(Author author)
        {
            _context.Authors.Add(author);
            _context.SaveChanges();
        }

        public List<NewBook> GetAllNewBooks()
        {
            return _context.NewBooks.Include(nb => nb.author).ToList();
        }

        public NewBook GetBookByTitle(string title)
        {
            return _context.NewBooks.FirstOrDefault(x => x.Title == title);
        }

        public Author GetAuthorByName(string name)
        {
            return _context.Authors.FirstOrDefault(a => a.AuthorName == name);
        }

        public void AddNewBook(NewBook newBook)
        {
            _context.NewBooks.Add(newBook);
            _context.SaveChanges();
        }

        public void AddSales(Sales sales)
        {
            _context.Sales.Add(sales);
            _context.SaveChanges();
        }
    }
}
