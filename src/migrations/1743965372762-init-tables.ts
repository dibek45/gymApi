import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1743965372762 implements MigrationInterface {
    name = 'InitTables1743965372762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            UPDATE "gym" SET "name" = 'Gimnasio por defecto' WHERE "name" IS NULL;
          `);
          
        await queryRunner.query(`ALTER TABLE "gym" ALTER COLUMN "name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gym" ALTER COLUMN "name" DROP NOT NULL`);
    }

}
