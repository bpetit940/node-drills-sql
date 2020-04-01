const ShoppingService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping service object`, function() {
  let db;
  let testArticles = [
    {
      id: 1,
      name: "List 1",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      price: "12",
      category: "Main",
      checked: false
    },
    {
      id: 2,
      name: "List 2",
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      price: "10",
      category: "Lunch",
      checked: false
    },
    {
      id: 3,
      name: "List 3",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      price: "20",
      category: "Snack",
      checked: false
    }
  ];
  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });
  before(() => db("shopping_list").truncate());
  afterEach(() => db("shopping_list").truncate());
  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testArticles);
    });

    it(`updateArticle() updates an article from the 'shopping_list' table`, () => {
      const idOfArticleToUpdate = 3;
      const newArticleData = {
        name: "updated title",
        price: "12",
        date_added: new Date(),
        category: "Snack",
        checked: false
      };
      return ShoppingService.updateArticle(
        db,
        idOfArticleToUpdate,
        newArticleData
      )
        .then(() => ShoppingService.getById(db, idOfArticleToUpdate))
        .then(article => {
          expect(article).to.eql({
            id: idOfArticleToUpdate,
            ...newArticleData
          });
        });
    });

    it(`deleteArticle() removes an article by id from 'shopping_list' table`, () => {
      const articleId = 3;
      return ShoppingService.deleteArticle(db, articleId)
        .then(() => ShoppingService.getAllArticles(db))
        .then(allArticles => {
          // copy the test articles array without the "deleted" article
          const expected = testArticles.filter(
            article => article.id !== articleId
          );
          expect(allArticles).to.eql(expected);
        });
    });

    it(`getById() resolves an article by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestArticle = testArticles[thirdId - 1];
      return ShoppingService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          checked: thirdTestArticle.checked,
          price: thirdTestArticle.price,
          name: thirdTestArticle.name,
          category: thirdTestArticle.category,
          date_added: thirdTestArticle.date_added
        });
      });
    });

    it(`getAllArticles() resolves all atricles from 'shopping_list' table`, () => {
      // test that ArticlesService.getAllArticles gets data from table
      return ShoppingService.getAllArticles(db).then(actual => {
        expect(actual).to.eql(testArticles);
      });
    });
  });

  context(`Given 'shopping-list' has no data`, () => {
    it(`getAllArticles() resolves an empty array`, () => {
      return ShoppingService.getAllArticles(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
    it(`insertArticle() inserts a new article and resolves the new article with an 'id'`, () => {
      const newArticle = {
        name: "Test new title",
        category: "Main",
        checked: false,
        price: "20",
        date_added: new Date("2020-01-01T00:00:00.000Z")
      };
      return ShoppingService.insertArticle(db, newArticle).then(actual => {
        expect(actual).to.eql({
          id: 1,
          name: newArticle.name,
          price: newArticle.price,
          checked: newArticle.checked,
          category: newArticle.category,
          date_added: newArticle.date_added
        });
      });
    });
  });
});
