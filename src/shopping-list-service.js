const ShoppingService = {
  getAllArticles(knex) {
    return knex.select("*").from("shopping_list");
  },
  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into("shopping_list")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex
      .from("shopping_list")
      .select("*")
      .where("id", id)
      .first();
  },
  deleteArticle(knex, id) {
    return knex("shopping_list")
      .where({ id })
      .delete();
  },
  updateArticle(knex, id, newArticleFields) {
    return knex("shopping_list")
      .where({ id })
      .update(newArticleFields);
  }
};

module.exports = ShoppingService;
