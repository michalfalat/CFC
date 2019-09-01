using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class CompanyOwnerRole : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "ApplicationUserCompany",
                nullable: false,
                defaultValue: 1);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "ApplicationUserCompany");
        }
    }
}
