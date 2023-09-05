import {
  type Alignment,
  type Borders,
  type Cell,
  type FillPattern,
  type Workbook,
  type Worksheet,
} from "exceljs";
import saveAs from "file-saver";

const getCellStyle = (width: number, color: string) => ({
  width: width,
  border: {
    top: { style: "medium" },
    bottom: { style: "medium" },
    left: { style: "medium" },
    right: { style: "medium" },
  } as Borders,
  fill: {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: color },
  } as FillPattern,
  font: { name: "Calibri", family: 4, size: 12, bold: true },
  alignment: {
    vertical: "middle",
    horizontal: "center",
    wrapText: true,
  } as Alignment,
});

const applyCellStyles = (
  worksheet: Worksheet,
  cell: Cell,
  colIdx: number,
  style: ReturnType<typeof getCellStyle>
) => {
  cell.fill = style.fill;
  cell.border = style.border;
  cell.font = style.font;
  cell.alignment = style.alignment;
  worksheet.getColumn(colIdx).width = style.width;
};

const noneStyle = getCellStyle(15, "FFD9D9D9"); // grey
const maintenanceStyle = getCellStyle(27, "FFADD8E6"); // blue
const cleaningStyle = getCellStyle(27, "FFF2F2F2"); // light grey
const furnishingStyle = getCellStyle(27, "FFD9D9D9"); // grey
const gardeningStyle = getCellStyle(27, "FFF2F2F2"); // light grey
const committeeStyle = getCellStyle(27, "FFD9D9D9"); // grey
const statusStyle = getCellStyle(25, "FFADD8E6"); // blue
const daysStyle = getCellStyle(25, "FFADD8E6"); // blue

/**
 * This function applies the styles to the provided worksheet
 * according to the column index
 * @param worksheet worksheet to apply styles to
 */
export const styleTemplateWorkbook = (worksheet: Worksheet) => {
  const headerRow = worksheet.getRow(1);
  headerRow.height = 50;
  // apply styles to the header
  headerRow.eachCell((cell, colIdx) => {
    // apply styles to the header according to the column index (colIdx) like the styles above
    if (colIdx > 0 && colIdx < 5) {
      applyCellStyles(worksheet, cell, colIdx, noneStyle);
    } else if (colIdx > 4 && colIdx < 9) {
      applyCellStyles(worksheet, cell, colIdx, maintenanceStyle);
    } else if (colIdx > 8 && colIdx < 12) {
      applyCellStyles(worksheet, cell, colIdx, cleaningStyle);
    } else if (colIdx > 11 && colIdx < 15) {
      applyCellStyles(worksheet, cell, colIdx, furnishingStyle);
    } else if (colIdx > 14 && colIdx < 18) {
      applyCellStyles(worksheet, cell, colIdx, gardeningStyle);
    } else if (colIdx > 17 && colIdx < 21) {
      applyCellStyles(worksheet, cell, colIdx, committeeStyle);
    } else if (colIdx > 20 && colIdx < 22) {
      applyCellStyles(worksheet, cell, colIdx, statusStyle);
    }
  });
};

export const styleOutputWorkbook = (worksheet: Worksheet) => {
  // like the function above, apply styles to the output workbook
  // according to the column index (colIdx) like the styles above
  // for the new columns added to the output workbook except for totalDaysToPrepareTheHouse
  // apply similar to the maintenanceStyle above
  // and for totalDaysToPrepareTheHouse apply similar to the committeeStyle above

  // TODO update the coloring accordingly
  const headerRow = worksheet.getRow(1);
  headerRow.height = 50;
  headerRow.eachCell((cell, colIdx) => {
    if (colIdx > 0 && colIdx < 5) {
      applyCellStyles(worksheet, cell, colIdx, noneStyle);
    } else if (colIdx > 4 && colIdx < 9) {
      applyCellStyles(worksheet, cell, colIdx, maintenanceStyle);
    } else if (colIdx > 8 && colIdx < 12) {
      applyCellStyles(worksheet, cell, colIdx, cleaningStyle);
    } else if (colIdx > 11 && colIdx < 15) {
      applyCellStyles(worksheet, cell, colIdx, furnishingStyle);
    } else if (colIdx > 14 && colIdx < 18) {
      applyCellStyles(worksheet, cell, colIdx, gardeningStyle);
    } else if (colIdx > 17 && colIdx < 21) {
      applyCellStyles(worksheet, cell, colIdx, committeeStyle);
    } else if (colIdx > 20 && colIdx < 22) {
      applyCellStyles(worksheet, cell, colIdx, statusStyle);
    } else if (colIdx > 21 && colIdx < 23) {
      applyCellStyles(worksheet, cell, colIdx, daysStyle);
    }
  });
};

/**
 * This function saves the provided workbook to the provided file name
 *
 * @param workbook workbook to save
 * @param fileName name of file to save as
 */
export const saveWorkbook = async (workbook: Workbook, fileName: string) => {
  await workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    saveAs(blob, fileName);
  });
};

/**
 * This is the set of columns that are expected in the excel file
 * to be imported, and shown in the template file
 */
export const excelTemplateColumns = [
  { header: "House No.", key: "unitNumber" },
  { header: "Court", key: "court" },
  { header: "BR No.", key: "bedrooms" },
  { header: "Area (m2)", key: "area" },
  {
    header: "Date Sent to Maintenance",
    key: "dateSubmittedToMaintenance",
  },
  {
    header: "Date Received by Maintenance",
    key: "dateReceivedByMaintenance",
  },
  {
    header: "Date Received from Maintenance (DD-MM-YY)",
    key: "dateReceivedFromMaintenance",
  },
  {
    header: "Date Required by Personnel (DD-MM-YY)",
    key: "dateRequiredByPersonnel",
  },
  {
    header: "Date Submitted to Cleaning  (DD-MM-YY)",
    key: "dateSubmittedToCleaning",
  },
  {
    header: "Expected Date of Cleaning Completion (DD-MM-YY)",
    key: "dateExpectedCleaningCompletion",
  },
  {
    header: "Date Completed Cleaning (DD-MM-YY)",
    key: "dateCompletedCleaning",
  },
  {
    header: "Actual Submission Date to Furnitre (DD-MM-YY)",
    key: "dateSubmittedToFurnishing",
  },
  {
    header: "Expected Date of Furnishing Completion (DD-MM-YY)",
    key: "dateExpectedFurnishingCompletion",
  },
  {
    header: "Date Furnishing Completed (DD-MM-YY)",
    key: "dateCompletedFurnishing",
  },
  {
    header: "Actual Submission Date to Gardening (DD-MM-YY)",
    key: "dateSubmittedToGardening",
  },
  {
    header: "Expected Date of Gardening Completion (DD-MM-YY)",
    key: "dateExpectedGardeningCompletion",
  },
  {
    header: "Date Gardening Completed (DD-MM-YY)",
    key: "dateCompletedGardening",
  },
  {
    header: "Date Checked and Submited to Committee (DD-MM-YY)",
    key: "dateCheckedAndSubmittedToCommittee",
  },
  {
    header: "Housing Services Satisfaction Statsus",
    key: "housingServicesSatisfactionStatus",
  },
  { header: "Comment", key: "comment" },
];

/**
 * This is the set of columns to be exported in output excel file
 */
export const excelOutputColumns = [
  { header: "S/N", key: "serialNumber" },
  ...excelTemplateColumns.slice(0, -3),
  // for the days columns, apply the daysStyle above
  {
    header: "No of Days to complete Maintenance (days)",
    key: "daysToCompleteMaintenance",
  },
  {
    header: "No of Days to complete Cleaning (days)",
    key: "daysToCompleteCleaning",
  },
  {
    header: "No of Days to complete Furniture (Days)",
    key: "daysToCompleteFurniture",
  },
  {
    header: "No of Days to complete Gardening (Days)",
    key: "daysToCompleteGardening",
  },
  {
    header: "Total Days to Complete Housing Duties",
    key: "totalDaysToCompleteHousingDuties",
  },
  {
    header: "Total Days to Submit to Committee",
    key: "totalDaysToSubmitToCommittee",
  },
  {
    header: "Days Houses Received Later than planned",
    key: "daysHousesReceivedLaterThanPlanned",
  },
  {
    header: "Total Days to prepare the House",
    key: "totalDaysToPrepareTheHouse",
  },
  // for the status column, apply the statusStyle above
  ...excelTemplateColumns.slice(-3),
];
