using Day12api.Model;

namespace Day12api.Repositories
{
    public interface IBookRepository
    {
        IEnumerable<Book> GetAllBooks();
        void AddBook(Book book);
        bool DeleteBook(int id);
        void AddAuthor(Author author);
        List<NewBook> GetAllNewBooks();
        NewBook GetBookByTitle(string title);
        Author GetAuthorByName(string name);
        void AddNewBook(NewBook newBook);
        void AddSales(Sales sales);
    }
}
