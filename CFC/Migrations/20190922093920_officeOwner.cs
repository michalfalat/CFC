using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class officeOwner : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatorId",
                table: "Offices",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offices_CreatorId",
                table: "Offices",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offices_AspNetUsers_CreatorId",
                table: "Offices",
                column: "CreatorId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offices_AspNetUsers_CreatorId",
                table: "Offices");

            migrationBuilder.DropIndex(
                name: "IX_Offices_CreatorId",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Offices");
        }
    }
}
