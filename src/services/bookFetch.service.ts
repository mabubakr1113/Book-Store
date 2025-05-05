import { Book, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchBooks = async (search: string): Promise<Book[]> => {
  const lowerSearch = search.toLowerCase();

  const books = await prisma.book.findMany();

  return books.filter(
    (book: Book) =>
      book.title.toLowerCase().includes(lowerSearch) ||
      book.authorList.some((author: string) =>
        author.toLowerCase().includes(lowerSearch)
      ) ||
      book.genreList.some((genre: string) =>
        genre.toLowerCase().includes(lowerSearch)
      )
  );
};

export const getBookByIdService = async (id: string): Promise<Book | null> => {
  return prisma.book.findUnique({ where: { id } });
};
