import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export interface ReportColumn {
  key: string
  label: string
}

interface ExportExcelParams {
  judul: string
  namaFile: string
  columns: ReportColumn[]
  rows: Record<string, string | number>[]
}

interface ExportPdfParams {
  judul: string
  periode: string
  namaFile: string
  columns: ReportColumn[]
  rows: Record<string, string | number>[]
}

function getTanggalFile() {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
    now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
    now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function exportReportExcel({
  judul,
  namaFile,
  columns,
  rows,
}: ExportExcelParams) {
  const data = rows.map(
    (row, index) => {
      const result: Record<
        string,
        string | number
      > = {
        No: index + 1,
      }

      columns.forEach(
        (column) => {
          result[column.label] =
            row[column.key] ?? '-'
        }
      )

      return result
    }
  )

  const worksheet =
    XLSX.utils.json_to_sheet(
      data
    )

  const workbook =
    XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    'Laporan'
  )

  const columnWidths = [
    {
      wch: 6,
    },
    ...columns.map(
      (column) => ({
        wch: Math.max(
          column.label.length + 4,
          18
        ),
      })
    ),
  ]

  worksheet['!cols'] =
    columnWidths

  XLSX.writeFile(
    workbook,
    `${namaFile}-${getTanggalFile()}.xlsx`
  )

  return judul
}

export function exportReportPdf({
  judul,
  periode,
  namaFile,
  columns,
  rows,
}: ExportPdfParams) {
  const orientation =
    columns.length >= 7
      ? 'landscape'
      : 'portrait'

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth =
    doc.internal.pageSize.getWidth()

  doc.setFontSize(16)

  doc.setFont(
    'helvetica',
    'bold'
  )

  doc.text(
    judul,
    pageWidth / 2,
    16,
    {
      align: 'center',
    }
  )

  doc.setFontSize(10)

  doc.setFont(
    'helvetica',
    'normal'
  )

  doc.text(
    'Sistem Manajemen Kepegawaian Digital',
    pageWidth / 2,
    22,
    {
      align: 'center',
    }
  )

  doc.setFontSize(9)

  doc.text(
    `Periode: ${periode}`,
    14,
    31
  )

  doc.text(
    `Total Data: ${rows.length}`,
    14,
    36
  )

  const head = [
    [
      'No',
      ...columns.map(
        (column) =>
          column.label
      ),
    ],
  ]

  const body = rows.map(
    (row, index) => [
      String(index + 1),

      ...columns.map(
        (column) =>
          String(
            row[column.key] ??
              '-'
          )
      ),
    ]
  )

  autoTable(doc, {
    startY: 42,
    head,
    body,

    styles: {
      fontSize:
        columns.length >= 7
          ? 7
          : 8,
      cellPadding: 2.2,
      overflow: 'linebreak',
      valign: 'middle',
    },

    headStyles: {
      fillColor: [
        15,
        23,
        42,
      ],
      textColor: [
        255,
        255,
        255,
      ],
      fontStyle: 'bold',
    },

    alternateRowStyles: {
      fillColor: [
        248,
        250,
        252,
      ],
    },

    margin: {
      top: 15,
      left: 10,
      right: 10,
    },

    didDrawPage: () => {
      const pageHeight =
        doc.internal.pageSize.getHeight()

      const currentPage =
        doc.getNumberOfPages()

      doc.setFontSize(8)

      doc.setTextColor(
        100
      )

      doc.text(
        `Halaman ${currentPage}`,
        pageWidth - 14,
        pageHeight - 8,
        {
          align: 'right',
        }
      )
    },
  })

  doc.save(
    `${namaFile}-${getTanggalFile()}.pdf`
  )
}