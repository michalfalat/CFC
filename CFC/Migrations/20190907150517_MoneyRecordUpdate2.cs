using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class MoneyRecordUpdate2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoneyRecords_Companies_CompanyId",
                table: "MoneyRecords");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "MoneyRecords",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_MoneyRecords_Companies_CompanyId",
                table: "MoneyRecords",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MoneyRecords_Companies_CompanyId",
                table: "MoneyRecords");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "MoneyRecords",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MoneyRecords_Companies_CompanyId",
                table: "MoneyRecords",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
