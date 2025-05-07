import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTables1743961480887 implements MigrationInterface {
  name = "InitTables1743961480887";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "available" boolean NOT NULL DEFAULT false,
        "img" text,
        "stock" integer NOT NULL,
        "price" double precision NOT NULL,
        "categoryId" integer,
        "gym_id" integer,
        "barcode" character varying(50),
        "isMembership" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "product_to_sale" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "price" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_74e38849b483924427f936c440a" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "sale_detail" (
        "id" SERIAL NOT NULL,
        "quantity" integer NOT NULL,
        "unitPrice" numeric(10,2) NOT NULL,
        "totalPrice" numeric(10,2) NOT NULL,
        "membershipName" character varying,
        "isMembership" boolean NOT NULL DEFAULT false,
        "saleId" integer,
        "productId" integer,
        CONSTRAINT "PK_4a2e151a26169857b1f3d47c198" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "cash_movement" (
        "id" SERIAL NOT NULL,
        "amount" numeric(10,2) NOT NULL,
        "type" character varying NOT NULL,
        "concept" character varying,
        "movementDate" TIMESTAMP NOT NULL DEFAULT now(),
        "cashRegisterId" integer NOT NULL,
        "cashierId" integer,
        "saleId" integer,
        "gymId" integer,
        CONSTRAINT "PK_66bd739ff97dd3242e7d53a2780" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "plan" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "actived" boolean NOT NULL DEFAULT false,
        "price" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "gymId" integer NOT NULL,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "exercise_type" (
        "id" SERIAL NOT NULL,
        "name" character varying(50) NOT NULL,
        "gymId" integer NOT NULL,
        CONSTRAINT "PK_13e525267d44e7aa48ea8b26e56" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "routine" (
        "id" SERIAL NOT NULL,
        "name" character varying(50) NOT NULL,
        "description" text,
        "link" text NOT NULL,
        "path" text NOT NULL,
        "count" integer NOT NULL,
        "exerciseTypeId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_5f1178fd54059b2f9479d6141ec" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "qr_codes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "expiresAt" TIMESTAMP NOT NULL,
        "userId" integer,
        CONSTRAINT "PK_4b7aa338e150a878ce9e2c55c5c" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "petty_cash" (
        "id" SERIAL NOT NULL,
        "balance" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "gymId" integer NOT NULL,
        CONSTRAINT "PK_8f854b821a0dad7463c86cfe8d0" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "petty_cash"`);
    await queryRunner.query(`DROP TABLE "qr_codes"`);
    await queryRunner.query(`DROP TABLE "routine"`);
    await queryRunner.query(`DROP TABLE "exercise_type"`);
    await queryRunner.query(`DROP TABLE "plan"`);
    await queryRunner.query(`DROP TABLE "cash_movement"`);
    await queryRunner.query(`DROP TABLE "sale_detail"`);
    await queryRunner.query(`DROP TABLE "product_to_sale"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
