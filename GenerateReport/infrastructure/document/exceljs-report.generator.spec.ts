import ExcelJS from "exceljs";

import {ExcelJsReportGenerator} from "./exceljs-report.generator";

describe("ExcelJsReportGenerator", () => {

    it("should generate workbook with report data", async () => {

        const generator = new ExcelJsReportGenerator();

        const content = await generator.generate({
            reportId: "REP-100",
            customerId: "CUS-100",
            data: {
                customer: {
                    customerId: "CUS-100",
                    name: "Olek Customer",
                    documentNumber: "DOC-100",
                    segment: "PREMIUM",
                    email: "customer@example.com"
                },
                orders: [{
                    orderId: "ORD-100",
                    customerId: "CUS-100",
                    orderDate: "2026-08-10T10:00:00.000Z",
                    total: 250,
                    currency: "PEN",
                    status: "COMPLETED"
                }],
                payments: [{
                    paymentId: "PAY-100",
                    customerId: "CUS-100",
                    paymentDate: "2026-08-10T12:00:00.000Z",
                    amount: 250,
                    currency: "PEN",
                    status: "SETTLED"
                }]
            }
        });

        expect(content.byteLength).toBeGreaterThan(0);

        const workbook = new ExcelJS.Workbook();

        const buffer = Buffer.from(content);

        await workbook.xlsx.load(buffer.buffer);

        expect(workbook.worksheets
            .map(worksheet => worksheet.name)).toEqual(["Summary", "Orders", "Payments"]);

        const summary = workbook.getWorksheet("Summary");

        expect(summary
            ?.getCell("B2").value).toBe("REP-100");

        const orders = workbook.getWorksheet("Orders");

        expect(orders
            ?.getCell("A2").value).toBe("ORD-100");

        const payments = workbook.getWorksheet("Payments");

        expect(payments
            ?.getCell("A2").value).toBe("PAY-100");
    });
});