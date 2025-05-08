import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUpdatedAtColumnToCashRegister1746499999999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('cash_register', new TableColumn({
      name: 'updatedAt',
      type: 'timestamp',
      isNullable: true, // o false si quieres que sea obligatorio
      default: 'now()' // puedes quitarlo si no quieres valor por defecto
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('cash_register', 'updatedAt');
  }
}
