import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSelfVoting1572385576950 implements MigrationInterface {
    name = 'AddSelfVoting1592772103377'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "sessions" ADD "optionsAllowdownvotes" boolean NOT NULL DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "templates" ADD "optionsAllowdownvotes" boolean NOT NULL DEFAULT false`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "optionsAllowdownvotes"`, undefined);
        await queryRunner.query(`ALTER TABLE "templates" DROP COLUMN "optionsAllowdownvotes"`, undefined);
    }

}
