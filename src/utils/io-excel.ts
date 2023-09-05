import { EventEmitter } from "events";
import { useEffect, useState } from "react";
import {
  excelTemplateColumns,
  saveWorkbook,
  styleTemplateWorkbook,
} from "~/utils/excel-utils";
import { differenceInDays } from "date-fns";
import * as Excel from "exceljs";
// use file saver
import { saveAs } from "file-saver";

import { zodHouseUnitSchema, type ZodHouseUnit } from "./validation";

type UseImportInput = {
  onRowsRead?: (rows: ValidatedRow[]) => void;
  /**
   * Callback function to be called on any faild rows after completed row validation
   * @param invalidRows passes the rows that failed validation
   * @returns void
   */
  onFailedRows?: (invalidRows: ValidatedRow[]) => void;
  onSuccess?: (rows: ZodHouseUnit[]) => void;
  onError?: (error: Error) => void;
};

type UseImportOutput = {
  /**
   * set the file to be processed
   * @param file
   * @returns void
   */
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  /**
   * returns true while the file is being processed
   * @returns boolean
   */
  isProcessingFile: boolean;
  /**
   * whether to replace the data in the database
   * @returns boolean
   * @default false
   * @see setReplaceData
   */
  replaceData: boolean;
  /**
   * set whether to replace the data in the database
   * @param replaceData
   * @returns void
   * @default false
   */
  setReplaceData: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * all valid rows
   * @returns ValidatedRow[]
   */
  validatedRows: ZodHouseUnit[];
  /**
   * all invalid rows
   * @returns ValidatedRow[]
   */
  invalidRows: ValidatedRow[];
};

// include row number, row data, success/failure, error message (if any)
type ValidatedRow = {
  row: number;
  data:
    | ZodHouseUnit
    | Excel.CellValue[]
    | {
        [key: string]: Excel.CellValue;
      };
  success: boolean;
  message: string | undefined;
};

// enum HouseSubmissionStatus {
//     NOT_STARTED
//     PENDING_MAINTENANCE_COMPLETION
//     PENDING_CLEANING_SUBMISSION
//     PENDING_CLEANING_COMPLETION
//     PENDING_FURNISHING_SUBMISSION
//     PENDING_FURNISHING_COMPLETION
//     PENDING_GARDENING_SUBMISSION
//     PENDING_GARDENING_COMPLETION
//     PENDING_FINAL_INSPECTION
//     PENDING_TENANT_ASSIGNMENT
//     EARLY_SUBMISSION
//     DONE_ON_TARGET
//     LATE_SUBMISSION
// }
const dayDifference = (date1: Date | null, date2: Date | null) => {
  if (!date1 || !date2) return 0;
  return differenceInDays(date1, date2);
};

const calculateDaysLaterThanPlanned = (houseUnit: ZodHouseUnit) => {
  // TODO calculate the days later than planned
  // by summing the days between the date submitted to departments and the date completed by departments
  // and the date completed by departments and the date submitted to committee

  // sum of every submission to expected completion of each department
  const daysPlannedToTake =
    dayDifference(
      houseUnit.dateSubmittedToMaintenance,
      houseUnit.dateRequiredByPersonnel
    ) +
    dayDifference(
      houseUnit.dateSubmittedToCleaning,
      houseUnit.dateExpectedCleaningCompletion
    ) +
    dayDifference(
      houseUnit.dateSubmittedToFurnishing,
      houseUnit.dateExpectedFurnishingCompletion
    ) +
    dayDifference(
      houseUnit.dateSubmittedToGardening,
      houseUnit.dateExpectedGardeningCompletion
    ) +
    dayDifference(
      houseUnit.dateExpectedGardeningCompletion,
      houseUnit.dateSubmitedToCommittee
    );
  // diff between date submitted to maintenance and date submitted to committee
  const daysTaken = dayDifference(
    houseUnit.dateSubmittedToMaintenance,
    houseUnit.dateSubmitedToCommittee
  );

  return daysPlannedToTake - daysTaken;
};

// TODO get this to run on every update of the database row
const setHouseSubmissionStatus = (rows: ZodHouseUnit[]) => {
  // default is not started
  rows.map((row) => {
    // Ferdaws court has no gardening
    const isFerdawsCourt = row.court.toLowerCase() === "Ferdaws";
    if (
      (row.dateSubmittedToMaintenance || row.dateReceivedByMaintenance) &&
      !row.dateReceivedFromMaintenance
    ) {
      row.submissionStatus = "PENDING_MAINTENANCE_COMPLETION";
    } else if (
      row.dateReceivedFromMaintenance &&
      !row.dateSubmittedToCleaning
    ) {
      row.submissionStatus = "PENDING_CLEANING_SUBMISSION";
    } else if (row.dateSubmittedToCleaning && !row.dateCompletedCleaning) {
      row.submissionStatus = "PENDING_CLEANING_COMPLETION";
    } else if (row.dateCompletedCleaning && !row.dateSubmittedToFurnishing) {
      row.submissionStatus = "PENDING_FURNISHING_SUBMISSION";
    } else if (row.dateSubmittedToFurnishing && !row.dateCompletedFurnishing) {
      row.submissionStatus = "PENDING_FURNISHING_COMPLETION";
    } else if (
      row.dateCompletedFurnishing &&
      !row.dateSubmittedToGardening &&
      // skip gardening for Ferdaws court
      !isFerdawsCourt
    ) {
      row.submissionStatus = "PENDING_GARDENING_SUBMISSION";
    } else if (
      row.dateSubmittedToGardening &&
      !row.dateCompletedGardening &&
      // skip gardening for Ferdaws court
      !isFerdawsCourt
    ) {
      row.submissionStatus = "PENDING_GARDENING_COMPLETION";
    } else if (row.dateCompletedGardening && !row.dateSubmitedToCommittee) {
      row.submissionStatus = "PENDING_FINAL_INSPECTION";
    } else if (
      row.dateSubmitedToCommittee &&
      calculateDaysLaterThanPlanned(row) > 1
    ) {
      row.submissionStatus = "LATE_SUBMISSION";
    } else if (
      row.dateSubmitedToCommittee &&
      calculateDaysLaterThanPlanned(row) < -1
    ) {
      row.submissionStatus = "EARLY_SUBMISSION";
    } else if (
      row.dateSubmitedToCommittee &&
      calculateDaysLaterThanPlanned(row) === 0
    ) {
      row.submissionStatus = "DONE_ON_TARGET";
    } else {
      row.submissionStatus = "NOT_STARTED";
    }
    console.log(
      "unit DLTP: ",
      row.unitNumber,
      calculateDaysLaterThanPlanned(row),
      row.submissionStatus
    );
  });
};

// refactor out the file reading portion of the hook to a separate private function
const readFile = async (file: File) => {
  // do something with exceljs...
  // use exceljs to parse the file
  const workbook = new Excel.Workbook();
  const validRows: ZodHouseUnit[] = [];
  const invalidRows: ValidatedRow[] = [];
  const fileBuffer = await file.arrayBuffer();
  // make sure to validate the row types into the correct types
  await workbook.xlsx.load(fileBuffer).then((workbook) => {
    const worksheet = workbook.getWorksheet(1);
    // TODO get the row count from user
    const rows = worksheet.getRows(2, worksheet.rowCount);
    if (!rows || rows.length === 0)
      throw new Error("No data found in the file");
    // saftey check for number of rows or culumns
    // (if the rows after the actual content were edited by mistake)
    if (rows.length > 5000)
      throw new Error("Too many rows, please limit to 5000 rows");
    rows.map((row, idx) => {
      const rowValues = row.values as Excel.CellValue[];
      // log all the cells in the row
      const rowData = {
        unitNumber: rowValues[1],
        court: rowValues[2],
        bedrooms: rowValues[3]
          ? parseInt(rowValues[3].toString().replace("e", ""))
          : null,
        extended: rowValues[3]?.toString().includes("e"),
        area: rowValues[4],
        dateSubmittedToMaintenance:
          rowValues[5] instanceof Date ? rowValues[5] : null,
        dateReceivedByMaintenance:
          rowValues[6] instanceof Date ? rowValues[6] : null,
        dateReceivedFromMaintenance:
          rowValues[7] instanceof Date ? rowValues[7] : null,
        dateRequiredByPersonnel:
          rowValues[8] instanceof Date ? rowValues[8] : null,
        dateSubmittedToCleaning:
          rowValues[9] instanceof Date ? rowValues[9] : null,
        dateExpectedCleaningCompletion:
          rowValues[10] instanceof Date ? rowValues[10] : null,
        dateCompletedCleaning:
          rowValues[11] instanceof Date ? rowValues[11] : null,
        dateSubmittedToFurnishing:
          rowValues[12] instanceof Date ? rowValues[12] : null,
        dateExpectedFurnishingCompletion:
          rowValues[13] instanceof Date ? rowValues[13] : null,
        dateCompletedFurnishing:
          rowValues[14] instanceof Date ? rowValues[14] : null,
        dateSubmittedToGardening:
          rowValues[15] instanceof Date ? rowValues[15] : null,
        dateExpectedGardeningCompletion:
          rowValues[16] instanceof Date ? rowValues[16] : null,
        dateCompletedGardening:
          rowValues[17] instanceof Date ? rowValues[17] : null,
        dateSubmitedToCommittee:
          rowValues[18] instanceof Date ? rowValues[18] : null,
        satisfactionStatus: rowValues[20],
        comments: rowValues[21] ?? null,
      } as unknown as ZodHouseUnit;

      const isRowEmpty = Object.values(rowData).every(
        (value) => value === null || value === undefined
      );
      if (isRowEmpty) {
        // if row is empty, skip it
        return;
      }
      // console.log(idx, rowData);
      const validatedRow = zodHouseUnitSchema.safeParse(rowData);
      if (!validatedRow.success) {
        console.error(validatedRow.error);
        // if failed, check if there are absolutely no defined values
        // meaning that every value in the data is either null or undefined
        invalidRows.push({
          row: idx,
          data: rowData,
          success: validatedRow.success,
          message: validatedRow.success
            ? undefined
            : validatedRow.error?.issues[0]?.message,
        });
      } else if (validatedRow.success) {
        validRows.push(validatedRow.data);
      }
    });
  });

  return {
    validRows: validRows,
    invalidRows: invalidRows,
  };
};

// TODO: importDataFn is of type mutate function of trpc mutation
// create a callback function to be called when the reader has got all the rows for the data

export const useImportExcel: (input: UseImportInput) => UseImportOutput = ({
  onRowsRead,
  onFailedRows,
  onSuccess,
  onError,
}) => {
  const [file, setFile] = useState<File | undefined>();
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [validRows, setValidRows] = useState<ZodHouseUnit[]>([]);
  const [invalidRows, setInvalidRows] = useState<ValidatedRow[]>([]);

  useEffect(() => {
    const processFile = async () => {
      if (!file) return;

      setIsProcessingFile(true);

      try {
        const { validRows, invalidRows } = await readFile(file);
        setIsProcessingFile(false);

        // TODO use the replaceData flag to determine whether to replace the data in the database

        // perform the invalid rows callback
        if (onFailedRows && invalidRows.length > 0) {
          setInvalidRows(invalidRows);
          onFailedRows(invalidRows);
        }

        if (onSuccess && invalidRows.length === 0) {
          // got through all the valid rows and check for the dates
          // and set the house submission status accordingly
          setHouseSubmissionStatus(validRows);
          setValidRows(validRows);
          onSuccess(validRows);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Unknown error");
        if (onError) onError(err);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    processFile();
  }, [file]);

  return {
    /**
     * set the file to be processed
     * @param file
     * @returns void
     */
    setFile: setFile,
    /**
     * returns true while the file is being processed
     * @returns boolean
     */
    isProcessingFile: isProcessingFile,
    /**
     * all valid rows
     * @returns ValidatedRow[]
     */
    validatedRows: validRows,
    /**
     * all invalid rows
     * @returns ValidatedRow[]
     */
    invalidRows: invalidRows,
  } as UseImportOutput;
};

export const getExcelTemplateFile = async () => {
  // return the file
  const workbook = new Excel.Workbook();
  const worksheet = workbook.addWorksheet("House-Units");

  // create a header row
  worksheet.columns = excelTemplateColumns;

  styleTemplateWorkbook(worksheet);

  // turn workbook into a file
  const fileName = "KPI Template File.xlsx";

  await saveWorkbook(workbook, fileName);
};

export const exportExcel = () => {
  // do something with exceljs...
};
