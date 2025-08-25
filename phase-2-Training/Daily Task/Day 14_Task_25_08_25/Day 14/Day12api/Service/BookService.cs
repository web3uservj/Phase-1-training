using Day12api.Model;
using Day12api.Repositories;

namespace Day12api.Service
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _repository;

        public BookService(IBookRepository repository)
        {
            _repository = repository;
        }

        public IEnumerable<Book> GetAllBooks()
        {
            return _repository.GetAllBooks();
        }

        public string AddBook(Book book)
        {
            _repository.AddBook(book);
            return "Book added successfully";
        }

        public string DeleteBook(int id)
        {
            var result = _repository.DeleteBook(id);
            return result ? "Book deleted successfully" : "Book not found";
        }

        public string AddAuthor(Author author)
        {
            _repository.AddAuthor(author);
            return "Author added successfully";
        }

        public List<NewBook> GetAllNewBooks()
        {
            return _repository.GetAllNewBooks();
        }

        public string AddSalesInfo(SalesEntry entry)
        {
            var book = _repository.GetBookByTitle(entry.Book_name);
            if (book == null)
                return "Invalid book name";

            var sales = new Sales
            {
                BookId = book.NewBookId,
                num_of_copies = entry.num_of_copies,
                Year = entry.Year
            };

            _repository.AddSales(sales);
            return "Sales information added successfully";
        }

        public string AddNewBook(BookAndAuthorEntry entry)
        {
            var author = _repository.GetAuthorByName(entry.AuthorName);
            if (author == null)
                return "Invalid author name";

            var book = new NewBook
            {
                Title = entry.BookTitle,
                AuthorId = author.AuthorId,
                price = entry.Price
            };

            _repository.AddNewBook(book);
            return "New book added successfully";
        }
    }
}
