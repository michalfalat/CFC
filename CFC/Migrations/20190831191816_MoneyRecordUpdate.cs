using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class MoneyRecordUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoneyRecords_AspNetUsers_CreatorId1",
                table: "MoneyRecords");

            migrationBuilder.DropIndex(
                name: "IX_MoneyRecords_CreatorId1",
                table: "MoneyRecords");

            migrationBuilder.DropColumn(
                name: "CreatorId1",
                table: "MoneyRecords");

            migrationBuilder.AlterColumn<string>(
                name: "CreatorId",
                table: "MoneyRecords",
                nullable: true,
                oldClrType: typeof(Guid));

            migrationBuilder.CreateIndex(
                name: "IX_MoneyRecords_CreatorId",
                table: "MoneyRecords",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_MoneyRecords_AspNetUsers_CreatorId",
                table: "MoneyRecords",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoneyRecords_AspNetUsers_CreatorId",
                table: "MoneyRecords");

            migrationBuilder.DropIndex(
                name: "IX_MoneyRecords_CreatorId",
                table: "MoneyRecords");

            migrationBuilder.AlterColumn<Guid>(
                name: "CreatorId",
                table: "MoneyRecords",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatorId1",
                table: "MoneyRecords",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MoneyRecords_CreatorId1",
                table: "MoneyRecords",
                column: "CreatorId1");

            migrationBuilder.AddForeignKey(
                name: "FK_MoneyRecords_AspNetUsers_CreatorId1",
                table: "MoneyRecords",
                column: "CreatorId1",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
