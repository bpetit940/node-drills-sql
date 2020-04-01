require("dotenv").config();

const knex = require("knex");
const ShoppingService = require("./shopping-list-service");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

// use all the ArticlesService methods!!
ShoppingService.getAllArticles(knexInstance)
  .then(articles => console.log(articles))
  .then(() =>
    ShoppingService.insertArticle(knexInstance, {
      title: "New title",
      content: "New content",
      date_published: new Date()
    })
  )
  .then(newArticle => {
    console.log(newArticle);
    return ShoppingService.updateArticle(knexInstance, newArticle.id, {
      title: "Updated title"
    }).then(() => ShoppingService.getById(knexInstance, newArticle.id));
  })
  .then(article => {
    console.log(article);
    return ShoppingService.deleteArticle(knexInstance, article.id);
  });
