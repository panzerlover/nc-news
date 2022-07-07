exports.isValidArticleColumn = (sort_by) => {
  const columns = ["title", "topic", "author", "body", "created_at", "votes"];
  return columns.includes(sort_by);
};
exports.isValidOrder = (order) => {
  const columns = ["asc", "desc"];
  return columns.includes(order);
};