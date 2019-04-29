using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Data.Migrations
{
    public partial class update_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffices_Companies_CompanyId",
                table: "CompanyOffices");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffices_Offices_OfficeId",
                table: "CompanyOffices");

            migrationBuilder.AlterColumn<int>(
                name: "OfficeId",
                table: "CompanyOffices",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "CompanyOffices",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyOffices_Companies_CompanyId",
                table: "CompanyOffices",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyOffices_Offices_OfficeId",
                table: "CompanyOffices",
                column: "OfficeId",
                principalTable: "Offices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffices_Companies_CompanyId",
                table: "CompanyOffices");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffices_Offices_OfficeId",
                table: "CompanyOffices");

            migrationBuilder.AlterColumn<int>(
                name: "OfficeId",
                table: "CompanyOffices",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "CompanyOffices",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyOffices_Companies_CompanyId",
                table: "CompanyOffices",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyOffices_Offices_OfficeId",
                table: "CompanyOffices",
                column: "OfficeId",
                principalTable: "Offices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
