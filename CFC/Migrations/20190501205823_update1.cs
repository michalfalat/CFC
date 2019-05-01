using Microsoft.EntityFrameworkCore.Migrations;

namespace CFC.Migrations
{
    public partial class update1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicatiionUserCompanies_Companies_CompanyId",
                table: "ApplicatiionUserCompanies");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicatiionUserCompanies_AspNetUsers_UserId",
                table: "ApplicatiionUserCompanies");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffices_Companies_CompanyId",
                table: "CompanyOffices");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffices_Offices_OfficeId",
                table: "CompanyOffices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Offices",
                table: "Offices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyOffices",
                table: "CompanyOffices");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ApplicatiionUserCompanies",
                table: "ApplicatiionUserCompanies");

            migrationBuilder.RenameTable(
                name: "Offices",
                newName: "Office");

            migrationBuilder.RenameTable(
                name: "CompanyOffices",
                newName: "CompanyOffice");

            migrationBuilder.RenameTable(
                name: "ApplicatiionUserCompanies",
                newName: "ApplicationUserCompany");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyOffices_OfficeId",
                table: "CompanyOffice",
                newName: "IX_CompanyOffice_OfficeId");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyOffices_CompanyId",
                table: "CompanyOffice",
                newName: "IX_CompanyOffice_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicatiionUserCompanies_UserId",
                table: "ApplicationUserCompany",
                newName: "IX_ApplicationUserCompany_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicatiionUserCompanies_CompanyId",
                table: "ApplicationUserCompany",
                newName: "IX_ApplicationUserCompany_CompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Office",
                table: "Office",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyOffice",
                table: "CompanyOffice",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ApplicationUserCompany",
                table: "ApplicationUserCompany",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserCompany_Companies_CompanyId",
                table: "ApplicationUserCompany",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicationUserCompany_AspNetUsers_UserId",
                table: "ApplicationUserCompany",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyOffice_Companies_CompanyId",
                table: "CompanyOffice",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CompanyOffice_Office_OfficeId",
                table: "CompanyOffice",
                column: "OfficeId",
                principalTable: "Office",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserCompany_Companies_CompanyId",
                table: "ApplicationUserCompany");

            migrationBuilder.DropForeignKey(
                name: "FK_ApplicationUserCompany_AspNetUsers_UserId",
                table: "ApplicationUserCompany");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffice_Companies_CompanyId",
                table: "CompanyOffice");

            migrationBuilder.DropForeignKey(
                name: "FK_CompanyOffice_Office_OfficeId",
                table: "CompanyOffice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Office",
                table: "Office");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CompanyOffice",
                table: "CompanyOffice");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ApplicationUserCompany",
                table: "ApplicationUserCompany");

            migrationBuilder.RenameTable(
                name: "Office",
                newName: "Offices");

            migrationBuilder.RenameTable(
                name: "CompanyOffice",
                newName: "CompanyOffices");

            migrationBuilder.RenameTable(
                name: "ApplicationUserCompany",
                newName: "ApplicatiionUserCompanies");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyOffice_OfficeId",
                table: "CompanyOffices",
                newName: "IX_CompanyOffices_OfficeId");

            migrationBuilder.RenameIndex(
                name: "IX_CompanyOffice_CompanyId",
                table: "CompanyOffices",
                newName: "IX_CompanyOffices_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationUserCompany_UserId",
                table: "ApplicatiionUserCompanies",
                newName: "IX_ApplicatiionUserCompanies_UserId");

            migrationBuilder.RenameIndex(
                name: "IX_ApplicationUserCompany_CompanyId",
                table: "ApplicatiionUserCompanies",
                newName: "IX_ApplicatiionUserCompanies_CompanyId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Offices",
                table: "Offices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CompanyOffices",
                table: "CompanyOffices",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ApplicatiionUserCompanies",
                table: "ApplicatiionUserCompanies",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicatiionUserCompanies_Companies_CompanyId",
                table: "ApplicatiionUserCompanies",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicatiionUserCompanies_AspNetUsers_UserId",
                table: "ApplicatiionUserCompanies",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

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
    }
}
