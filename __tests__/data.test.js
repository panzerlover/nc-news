
describe('data exporting correctly', () => {
    describe('test-data', () => {
        it('imported testData object should have all expected keys, with arrays as values', () => {
            const testData = require("../db/data/test-data/index.js");
            expect(testData).toEqual(expect.objectContaining({
                topicData: expect.any(Array),
                articleData: expect.any(Array),
                userData: expect.any(Array),
                commentData: expect.any(Array)
            }))
        });
    });
    describe('development-data', () => {
        it('should have all the expected keys, with arrays as values', () => {
            const devData = require("../db/data/development-data/index.js");
            expect(devData).toEqual(expect.objectContaining({
                topicData: expect.any(Array),
                articleData: expect.any(Array),
                userData: expect.any(Array),
                commentData: expect.any(Array)
            }))
        });
    });
});