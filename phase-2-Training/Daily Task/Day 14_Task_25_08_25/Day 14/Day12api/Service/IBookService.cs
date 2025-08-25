using Day12api.Model;

namespace Day12api.Service
{
    public interface IBookService
    {
        IEnumerable<Book> GetAllBooks();
        string AddBook(Book book);
        string DeleteBook(int id);
        string AddAuthor(Author author);
        List<NewBook> GetAllNewBooks();
        string AddSalesInfo(SalesEntry entry);
        string AddNewBook(BookAndAuthorEntry entry);
    }
}
