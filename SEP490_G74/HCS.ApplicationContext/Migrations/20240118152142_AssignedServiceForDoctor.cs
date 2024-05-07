using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HCS.ApplicationContext.Migrations
{
    /// <inheritdoc />
    public partial class AssignedServiceForDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DoctorId",
                table: "ServiceMedicalRecords",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ServiceMedicalRecords_DoctorId",
                table: "ServiceMedicalRecords",
                column: "DoctorId");

            migrationBuilder.AddForeignKey(
                name: "FK_ServiceMedicalRecords_Users_DoctorId",
                table: "ServiceMedicalRecords",
                column: "DoctorId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ServiceMedicalRecords_Users_DoctorId",
                table: "ServiceMedicalRecords");

            migrationBuilder.DropIndex(
                name: "IX_ServiceMedicalRecords_DoctorId",
                table: "ServiceMedicalRecords");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "ServiceMedicalRecords");
        }
    }
}
