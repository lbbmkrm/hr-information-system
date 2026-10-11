import { describe, it, expect } from 'vitest';
import prisma from './prisma.js';
describe('Database', () => {
    it('should connect to test database', async () => {
        const result = await prisma.$queryRaw `
            SELECT current_database()
        `;
        const database = result[0];
        expect(database).toBeDefined();
        expect(database?.current_database).toBe('hris_test');
    });
});
//# sourceMappingURL=example.test.js.map