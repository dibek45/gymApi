import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePriceField1743971546563 implements MigrationInterface {
    name = 'UpdatePriceField1743971546563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" ADD "category" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP COLUMN "category"`);
    }

}
