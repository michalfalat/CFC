using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class MoneyRecord : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MoneyRecords",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(nullable: false),
                    EditedAt = table.Column<DateTime>(nullable: false),
                    CreatorId = table.Column<Guid>(nullable: false),
                    CreatorId1 = table.Column<string>(nullable: true),
                    CompanyId = table.Column<int>(nullable: false),
                    OfficeId = table.Column<int>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    Amount = table.Column<decimal>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Obsolete = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MoneyRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MoneyRecords_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MoneyRecords_AspNetUsers_CreatorId1",
                        column: x => x.CreatorId1,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MoneyRecords_Offices_OfficeId",
                        column: x => x.OfficeId,
                        principalTable: "Offices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MoneyRecords_CompanyId",
                table: "MoneyRecords",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_MoneyRecords_CreatorId1",
                table: "MoneyRecords",
                column: "CreatorId1");

            migrationBuilder.CreateIndex(
                name: "IX_MoneyRecords_OfficeId",
                table: "MoneyRecords",
                column: "OfficeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MoneyRecords");
        }
    }
}
