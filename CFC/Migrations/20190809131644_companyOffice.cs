using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class companyOffice : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offices_Companies_CompanyId",
                table: "Offices");

            migrationBuilder.DropTable(
                name: "ApplicationUserOffice");

            migrationBuilder.DropIndex(
                name: "IX_Offices_CompanyId",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Offices");

            migrationBuilder.CreateTable(
                name: "CompanyOffices",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CompanyId = table.Column<int>(nullable: false),
                    OfficeId = table.Column<int>(nullable: false),
                    Percentage = table.Column<decimal>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyOffices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyOffices_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompanyOffices_Offices_OfficeId",
                        column: x => x.OfficeId,
                        principalTable: "Offices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyOffices_CompanyId",
                table: "CompanyOffices",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyOffices_OfficeId",
                table: "CompanyOffices",
                column: "OfficeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyOffices");

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Offices",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ApplicationUserOffice",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    OfficeId = table.Column<int>(nullable: false),
                    Percentage = table.Column<decimal>(nullable: false),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationUserOffice", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicationUserOffice_Offices_OfficeId",
                        column: x => x.OfficeId,
                        principalTable: "Offices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationUserOffice_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Offices_CompanyId",
                table: "Offices",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserOffice_OfficeId",
                table: "ApplicationUserOffice",
                column: "OfficeId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationUserOffice_UserId",
                table: "ApplicationUserOffice",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offices_Companies_CompanyId",
                table: "Offices",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
