const { isValidArticleColumn, isValidOrder } = require("../api/utils/input-validators")

describe('isValidArticleColumn', () => {
    it('should return true when passed a valid column', () => {
        const columns = ["title", "topic", "author", "body", "created_at", "votes"]
        columns.forEach((header)=> {
            expect(isValidArticleColumn(header)).toBe(true);
        })
    });
});
describe('isValidOrder', () => {
    it('should return true when passed a valid order', () => {
        const columns = ["asc", "desc"]
        columns.forEach((header)=> {
            expect(isValidOrder(header)).toBe(true);
        })
    });
});