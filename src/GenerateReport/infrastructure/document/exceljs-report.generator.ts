import ExcelJS from "exceljs";

import {ReportGenerator, ReportGeneratorInput} from "../../domain/report.generator";

export class ExcelJsReportGenerator implements ReportGenerator {

    async generate(input: ReportGeneratorInput): Promise<Uint8Array> {

        const workbook = new ExcelJS.Workbook();

        workbook.creator = "Financial Reports Functions";

        this.addSummarySheet(workbook, input);
        this.addOrdersSheet(workbook, input);
        this.addPaymentsSheet(workbook, input);
        const buffer = await workbook.xlsx
            .writeBuffer();

        return new Uint8Array(buffer);
    }

    private addSummarySheet(workbook: ExcelJS.Workbook, input: ReportGeneratorInput): void {

        const worksheet = workbook.addWorksheet("Summary");

        worksheet.columns = [
            {
                header: "Field",
                key: "field",
                width: 24
            },
            {
                header: "Value",
                key: "value",
                width: 40
            }
        ];

        worksheet.addRows([
            {
                field: "Report ID",
                value: input.reportId
            },
            {
                field: "Customer ID",
                value: input.customerId
            },
            {
                field: "Customer",
                value: input.data.customer.name
            },
            {
                field: "Document",
                value: input.data.customer.documentNumber
            },
            {
                field: "Segment",
                value: input.data.customer.segment
            },
            {
                field: "Email",
                value: input.data.customer.email
            },
            {
                field: "Orders",
                value: input.data.orders.length
            },
            {
                field: "Payments",
                value: input.data.payments.length
            }
        ]);

        worksheet.getRow(1).font = {
            bold: true
        };
    }

    private addOrdersSheet(workbook: ExcelJS.Workbook, input: ReportGeneratorInput): void {

        const worksheet = workbook.addWorksheet("Orders");

        worksheet.columns = [
            {
                header: "Order ID",
                key: "orderId",
                width: 20
            },
            {
                header: "Date",
                key: "orderDate",
                width: 26
            },
            {
                header: "Total",
                key: "total",
                width: 16
            },
            {
                header: "Currency",
                key: "currency",
                width: 12
            },
            {
                header: "Status",
                key: "status",
                width: 18
            }
        ];

        for (const order of input.data.orders) {

            worksheet.addRow({
                orderId: order.orderId,
                orderDate: order.orderDate,
                total: order.total,
                currency: order.currency,
                status: order.status
            });
        }

        worksheet.getRow(1).font = {
            bold: true
        };
    }

    private addPaymentsSheet(workbook: ExcelJS.Workbook, input: ReportGeneratorInput): void {

        const worksheet = workbook.addWorksheet("Payments");

        worksheet.columns = [
            {
                header: "Payment ID",
                key: "paymentId",
                width: 20
            },
            {
                header: "Date",
                key: "paymentDate",
                width: 26
            },
            {
                header: "Amount",
                key: "amount",
                width: 16
            },
            {
                header: "Currency",
                key: "currency",
                width: 12
            },
            {
                header: "Status",
                key: "status",
                width: 18
            }
        ];

        for (const payment of input.data.payments) {
            worksheet.addRow({
                paymentId: payment.paymentId,
                paymentDate: payment.paymentDate,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status
            });
        }

        worksheet.getRow(1).font = {
            bold: true
        };
    }
}