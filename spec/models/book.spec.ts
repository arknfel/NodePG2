import { Book, BookStore } from '../../src/models/book';


const store = new BookStore();


describe("Book Model", () => {
  it('should have an \'all\' method', () => {
    expect(store.all).toBeDefined();
  });

  it('\'all\' method should return a list', async () => {
    const result = await store.all();
    expect(result).toEqual([]);
  });

    it('should have method all()', () => {
    expect(store.all).toBeDefined();
  });
  
  it('should have method get()', () => {
    expect(store.get).toBeDefined();
  });

  it('should have method create()', () => {
    expect(store.create).toBeDefined();
  });

  it('should have method update()', () => {
    expect(store.update).toBeDefined();
  });

  it('should have method delete()', () => {
    expect(store.delete).toBeDefined();
  });

  it('\'create method should add a book\'', async () => {
    const result = await store.create({
      title: 'Bridge to Terabithia',
      total_pages: 250,
      author: 'Katherine Paterson',
      summary: 'NA'
    });
    expect(result).toEqual({
      id: 1,
      title: 'Bridge to Terabithia',
      total_pages: 250,
      author: 'Katherine Paterson',
      summary: 'NA'
    });
  });

  it('delete method should remove the book', async () => {
    store.delete("1");
    const result = await store.all();
    expect(result).toEqual([]);
  });
});