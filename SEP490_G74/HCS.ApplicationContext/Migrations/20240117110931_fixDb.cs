using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HCS.ApplicationContext.Migrations
{
    /// <inheritdoc />
    public partial class fixDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    CId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Gender = table.Column<bool>(type: "bit", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dob = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Img = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.CId);
                });

            migrationBuilder.CreateTable(
                name: "Prescriptions",
                columns: table => new
                {
                    PrescriptionId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Diagnose = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescriptions", x => x.PrescriptionId);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.RoleId);
                });

            migrationBuilder.CreateTable(
                name: "SuppliesTypes",
                columns: table => new
                {
                    SuppliesTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SuppliesTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuppliesTypes", x => x.SuppliesTypeId);
                });

            migrationBuilder.CreateTable(
                name: "ServiceTypes",
                columns: table => new
                {
                    ServiceTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceTypes", x => x.ServiceTypeId);
                    table.ForeignKey(
                        name: "FK_ServiceTypes_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceDetailName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Height = table.Column<byte>(type: "tinyint", nullable: true),
                    Weight = table.Column<byte>(type: "tinyint", nullable: true),
                    BloodGroup = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BloodPressure = table.Column<byte>(type: "tinyint", nullable: true),
                    Allergieshistory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.PatientId);
                    table.ForeignKey(
                        name: "FK_Patients_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "CId");
                });

            migrationBuilder.CreateTable(
                name: "ExaminationResults",
                columns: table => new
                {
                    ExamResultId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Diagnosis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Conclusion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExamDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PrescriptionId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExaminationResults", x => x.ExamResultId);
                    table.ForeignKey(
                        name: "FK_ExaminationResults_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "PrescriptionId");
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    ContactId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId");
                    table.ForeignKey(
                        name: "FK_Users_Contacts_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contacts",
                        principalColumn: "CId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Users_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "RoleId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Supplies",
                columns: table => new
                {
                    SId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Uses = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Exp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Distributor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UnitInStock = table.Column<short>(type: "smallint", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    Inputday = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SuppliesTypeId = table.Column<int>(type: "int", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Supplies", x => x.SId);
                    table.ForeignKey(
                        name: "FK_Supplies_SuppliesTypes_SuppliesTypeId",
                        column: x => x.SuppliesTypeId,
                        principalTable: "SuppliesTypes",
                        principalColumn: "SuppliesTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    ServiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<double>(type: "float", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ServiceTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.ServiceId);
                    table.ForeignKey(
                        name: "FK_Services_ServiceTypes_ServiceTypeId",
                        column: x => x.ServiceTypeId,
                        principalTable: "ServiceTypes",
                        principalColumn: "ServiceTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRecords",
                columns: table => new
                {
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MedicalRecordDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExamReason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsPaid = table.Column<bool>(type: "bit", nullable: false),
                    IsCheckUp = table.Column<bool>(type: "bit", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    ExaminationResultId = table.Column<int>(type: "int", nullable: true),
                    PreviousMedicalRecordId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecords", x => x.MedicalRecordId);
                    table.ForeignKey(
                        name: "FK_MedicalRecords_ExaminationResults_ExaminationResultId",
                        column: x => x.ExaminationResultId,
                        principalTable: "ExaminationResults",
                        principalColumn: "ExamResultId");
                    table.ForeignKey(
                        name: "FK_MedicalRecords_MedicalRecords_PreviousMedicalRecordId",
                        column: x => x.PreviousMedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "MedicalRecordId");
                    table.ForeignKey(
                        name: "FK_MedicalRecords_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "PatientId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Invoices",
                columns: table => new
                {
                    InvoiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false),
                    Total = table.Column<double>(type: "float", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    CashierId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invoices", x => x.InvoiceId);
                    table.ForeignKey(
                        name: "FK_Invoices_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "PatientId");
                    table.ForeignKey(
                        name: "FK_Invoices_Users_CashierId",
                        column: x => x.CashierId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "SuppliesPrescriptions",
                columns: table => new
                {
                    SId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    PrescriptionId = table.Column<int>(type: "int", nullable: false),
                    SupplyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuppliesPrescriptions", x => x.SId);
                    table.ForeignKey(
                        name: "FK_SuppliesPrescriptions_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "PrescriptionId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SuppliesPrescriptions_Supplies_SupplyId",
                        column: x => x.SupplyId,
                        principalTable: "Supplies",
                        principalColumn: "SId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRecordCategories",
                columns: table => new
                {
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecordCategories", x => new { x.CategoryId, x.MedicalRecordId });
                    table.ForeignKey(
                        name: "FK_MedicalRecordCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MedicalRecordCategories_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "MedicalRecordId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MedicalRecordDoctors",
                columns: table => new
                {
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    DoctorId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MedicalRecordDoctors", x => new { x.DoctorId, x.MedicalRecordId });
                    table.ForeignKey(
                        name: "FK_MedicalRecordDoctors_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "MedicalRecordId");
                    table.ForeignKey(
                        name: "FK_MedicalRecordDoctors_Users_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "ServiceMedicalRecords",
                columns: table => new
                {
                    ServiceId = table.Column<int>(type: "int", nullable: false),
                    MedicalRecordId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: true),
                    InvoiceId = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Diagnose = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServiceMedicalRecords", x => new { x.ServiceId, x.MedicalRecordId });
                    table.ForeignKey(
                        name: "FK_ServiceMedicalRecords_Invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalTable: "Invoices",
                        principalColumn: "InvoiceId");
                    table.ForeignKey(
                        name: "FK_ServiceMedicalRecords_MedicalRecords_MedicalRecordId",
                        column: x => x.MedicalRecordId,
                        principalTable: "MedicalRecords",
                        principalColumn: "MedicalRecordId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ServiceMedicalRecords_Services_ServiceId",
                        column: x => x.ServiceId,
                        principalTable: "Services",
                        principalColumn: "ServiceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "CategoryName", "IsDeleted" },
                values: new object[,]
                {
                    { 1, "Khám sơ bộ", false },
                    { 2, "Nội khoa", false },
                    { 3, "Ngoại khoa", false }
                });

            migrationBuilder.InsertData(
                table: "Contacts",
                columns: new[] { "CId", "Address", "Dob", "Gender", "Img", "Name", "Phone" },
                values: new object[,]
                {
                    { 1, "Ha Noi", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "", "Admin Khoa", "0987662512" },
                    { 2, "Ha Noi", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "", "Bsi Son", "0987662512" },
                    { 3, "Ha Noi", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "", "Bsi Bang", "0987662512" },
                    { 4, "Ha Noi", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "", "Bsi Tam", "0987662512" },
                    { 5, "Ha Noi", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "", "Bsi Van", "0987662512" },
                    { 6, "Ha Noi", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "", "Y Ta Nho", "0987662512" },
                    { 7, "Ha Noi", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "", "Cashier Trinh", "0987662512" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "RoleId", "RoleName" },
                values: new object[,]
                {
                    { 1, "Admin" },
                    { 2, "Doctor" },
                    { 3, "Cashier" },
                    { 4, "Nurse" }
                });

            migrationBuilder.InsertData(
                table: "ServiceTypes",
                columns: new[] { "ServiceTypeId", "CategoryId", "IsDeleted", "ServiceTypeName" },
                values: new object[,]
                {
                    { 1, 1, false, "Khám tổng quát" },
                    { 2, 2, false, "Chẩn đoán nội" },
                    { 3, 2, false, "Khám nội" },
                    { 4, 3, false, "Chẩn đoán ngoại" },
                    { 5, 3, false, "Khám ngoại" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "CategoryId", "ContactId", "Email", "IsDeleted", "Password", "RoleId", "Status" },
                values: new object[,]
                {
                    { 1, null, 1, "vkhoa871@gmail.com", false, "d0c406e82877aacad00415ca64f821e9", 1, true },
                    { 2, 1, 2, "sonnk1@gmail.com", false, "d0c406e82877aacad00415ca64f821e9", 2, true },
                    { 3, 2, 3, "doctor3@gmail.com", false, "d0c406e82877aacad00415ca64f821e9", 2, true },
                    { 4, 3, 4, "doctor4@gmail.com", false, "d0c406e82877aacad00415ca64f821e9", 2, true },
                    { 5, 3, 5, "doctor5@gmail.com", false, "d0c406e82877aacad00415ca64f821e9", 2, true },
                    { 6, null, 6, "yta1@gmail.com", false, "d0c406e82877aacad00415ca64f821e9", 4, true },
                    { 7, null, 7, "cashier1@gmail.com", false, "d0c406e82877aacad00415ca64f821e9", 3, true }
                });

            migrationBuilder.InsertData(
                table: "Services",
                columns: new[] { "ServiceId", "IsDeleted", "Price", "ServiceName", "ServiceTypeId" },
                values: new object[,]
                {
                    { 1, false, 100000.0, "Đo chỉ số tổng quát", 1 },
                    { 2, false, 50000.0, "Chẩn đoán nội soi dạ dày", 2 },
                    { 3, false, 70000.0, "Chẩn đoán nội soi thận", 2 },
                    { 4, false, 130000.0, "Khám nội soi dạ dày", 3 },
                    { 5, false, 120000.0, "Khám nội soi thận", 3 },
                    { 6, false, 110000.0, "Chẩn đoán ngoại trĩ", 4 },
                    { 7, false, 90000.0, "Chẩn đoán ngoại da liễu", 4 },
                    { 8, false, 113000.0, "Khám ngoại trĩ", 5 },
                    { 9, false, 40000.0, "Khám ngoại da liễu", 5 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExaminationResults_PrescriptionId",
                table: "ExaminationResults",
                column: "PrescriptionId",
                unique: true,
                filter: "[PrescriptionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_CashierId",
                table: "Invoices",
                column: "CashierId");

            migrationBuilder.CreateIndex(
                name: "IX_Invoices_PatientId",
                table: "Invoices",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecordCategories_MedicalRecordId",
                table: "MedicalRecordCategories",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecordDoctors_MedicalRecordId",
                table: "MedicalRecordDoctors",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_ExaminationResultId",
                table: "MedicalRecords",
                column: "ExaminationResultId",
                unique: true,
                filter: "[ExaminationResultId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_PatientId",
                table: "MedicalRecords",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_MedicalRecords_PreviousMedicalRecordId",
                table: "MedicalRecords",
                column: "PreviousMedicalRecordId",
                unique: true,
                filter: "[PreviousMedicalRecordId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_ContactId",
                table: "Patients",
                column: "ContactId",
                unique: true,
                filter: "[ContactId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceMedicalRecords_InvoiceId",
                table: "ServiceMedicalRecords",
                column: "InvoiceId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceMedicalRecords_MedicalRecordId",
                table: "ServiceMedicalRecords",
                column: "MedicalRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_ServiceTypeId",
                table: "Services",
                column: "ServiceTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ServiceTypes_CategoryId",
                table: "ServiceTypes",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Supplies_SuppliesTypeId",
                table: "Supplies",
                column: "SuppliesTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SuppliesPrescriptions_PrescriptionId",
                table: "SuppliesPrescriptions",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_SuppliesPrescriptions_SupplyId",
                table: "SuppliesPrescriptions",
                column: "SupplyId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CategoryId",
                table: "Users",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ContactId",
                table: "Users",
                column: "ContactId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MedicalRecordCategories");

            migrationBuilder.DropTable(
                name: "MedicalRecordDoctors");

            migrationBuilder.DropTable(
                name: "ServiceMedicalRecords");

            migrationBuilder.DropTable(
                name: "SuppliesPrescriptions");

            migrationBuilder.DropTable(
                name: "Invoices");

            migrationBuilder.DropTable(
                name: "MedicalRecords");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Supplies");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "ExaminationResults");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "ServiceTypes");

            migrationBuilder.DropTable(
                name: "SuppliesTypes");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Prescriptions");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
