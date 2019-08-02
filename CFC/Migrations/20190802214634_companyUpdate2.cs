using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class companyUpdate2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserCompany_Companies_CompanyId",
                table: "ApplicationUserCompany");

            migrationBuilder.RenameColumn(
                name: "Precentage",
                table: "ApplicationUserCompany",
                newName: "Percentage");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "ApplicationUserCompany",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserCompany_Companies_CompanyId",
                table: "ApplicationUserCompany",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserCompany_Companies_CompanyId",
                table: "ApplicationUserCompany");

            migrationBuilder.RenameColumn(
                name: "Percentage",
                table: "ApplicationUserCompany",
                newName: "Precentage");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "ApplicationUserCompany",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserCompany_Companies_CompanyId",
                table: "ApplicationUserCompany",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
