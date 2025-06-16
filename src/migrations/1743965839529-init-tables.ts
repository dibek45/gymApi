import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1743965839529 implements MigrationInterface {
    name = 'InitTables1743965839529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gym" ALTER COLUMN "name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gym" ALTER COLUMN "name" DROP NOT NULL`);
    }

}
