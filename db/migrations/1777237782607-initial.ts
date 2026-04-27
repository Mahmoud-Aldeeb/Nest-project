import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1777237782607 implements MigrationInterface {
    name = 'Initial1777237782607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."User_usertype_enum" AS ENUM('admin', 'normal_user')`);
        await queryRunner.query(`CREATE TABLE "User" ("id" SERIAL NOT NULL, "username" character varying(150), "email" character varying(250) NOT NULL, "password" character varying NOT NULL, "userType" "public"."User_usertype_enum" NOT NULL DEFAULT 'normal_user', "isAccountVerified" boolean NOT NULL DEFAULT false, "verificationToken" text, "resetPasswordToken" text, "createAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "profileImage" character varying, CONSTRAINT "UQ_4a257d2c9837248d70640b3e36e" UNIQUE ("email"), CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Review" ("id" SERIAL NOT NULL, "rating" integer NOT NULL, "comment" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "productId" integer, "userId" integer, CONSTRAINT "PK_4af5ddfa8a65e5571d851e4b752" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Product" ("id" SERIAL NOT NULL, "title" character varying(150) NOT NULL, "description" character varying NOT NULL, "price" double precision NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updatedAt" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "userId" integer, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Review" ADD CONSTRAINT "FK_352fe9dac22e24e333b17f1a968" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Review" ADD CONSTRAINT "FK_0d904edee7210750be2fe4c4dba" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_de75905c3b4987f4b5bb1472644" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_de75905c3b4987f4b5bb1472644"`);
        await queryRunner.query(`ALTER TABLE "Review" DROP CONSTRAINT "FK_0d904edee7210750be2fe4c4dba"`);
        await queryRunner.query(`ALTER TABLE "Review" DROP CONSTRAINT "FK_352fe9dac22e24e333b17f1a968"`);
        await queryRunner.query(`DROP TABLE "Product"`);
        await queryRunner.query(`DROP TABLE "Review"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TYPE "public"."User_usertype_enum"`);
    }

}
