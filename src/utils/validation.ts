import {
  HouseSatisfactionStatus,
  HouseSubmissionStatus,
  HouseUnit,
} from "@prisma/client";
import { date, z, ZodError, ZodIssueCode } from "zod";

// trun type into zod schema with correct types and error messages for each field
export const zodHouseUnitSchema = z.object({
  unitNumber: z
    .number({ invalid_type_error: "House No must be a number" })
    .int(),
  court: z.string({ invalid_type_error: "Court must be a string" }),
  bedrooms: z.number({ invalid_type_error: "Bedrooms must be a number" }).int(),
  extended: z
    .boolean({ invalid_type_error: "Extended must be a boolean" })
    .default(false),
  area: z.number({ invalid_type_error: "Area must be a number" }).default(0),
  dateSubmittedToMaintenance: z.preprocess(
    (val) => checkInvalidValue(val, "Date Submitted To Maintenance"),
    z
      .date({
        invalid_type_error: '"Date Submitted To Maintenance" must be a date',
      })
      .nullable()
  ),

  dateReceivedByMaintenance: z.preprocess(
    (val) => checkInvalidValue(val, "Date Received By Maintenance"),
    z
      .date({
        invalid_type_error: '"Date Received By Maintenance" must be a date',
      })
      .nullable()
  ),
  dateReceivedFromMaintenance: z.preprocess(
    (val) => checkInvalidValue(val, "Date Received From Maintenance"),
    z
      .date({
        invalid_type_error: '"Date Received From Maintenance" must be a date',
      })
      .nullable()
  ),
  dateRequiredByPersonnel: z.preprocess(
    (val) => checkInvalidValue(val, "Date Required By Personnel"),
    z
      .date({
        invalid_type_error: '"Date Required By Personnel" must be a date',
      })
      .nullable()
  ),
  dateSubmittedToCleaning: z.preprocess(
    (val) => checkInvalidValue(val, "Date Submitted To Cleaning"),
    z
      .date({
        invalid_type_error: '"Date Submitted To Cleaning" must be a date',
      })
      .nullable()
  ),
  dateExpectedCleaningCompletion: z.preprocess(
    (val) => checkInvalidValue(val, "Date Expected Cleaning Completion"),
    z
      .date({
        invalid_type_error:
          '"Date Expected Cleaning Completion" must be a date',
      })
      .nullable()
  ),
  dateCompletedCleaning: z.preprocess(
    (val) => checkInvalidValue(val, "Date Completed Cleaning"),
    z
      .date({
        invalid_type_error: '"Date Completed Cleaning" must be a date',
      })
      .nullable()
  ),
  dateSubmittedToFurnishing: z.preprocess(
    (val) => checkInvalidValue(val, "Date Submitted To Furnishing"),
    z
      .date({
        invalid_type_error: '"Date Submitted To Furnishing" must be a date',
      })
      .nullable()
  ),
  dateExpectedFurnishingCompletion: z.preprocess(
    (val) => checkInvalidValue(val, "Date Expected Furnishing Completion"),
    z
      .date({
        invalid_type_error:
          '"Date Expected Furnishing Completion" must be a date',
      })
      .nullable()
  ),
  dateCompletedFurnishing: z.preprocess(
    (val) => checkInvalidValue(val, "Date Completed Furnishing"),
    z
      .date({
        invalid_type_error: '"Date Completed Furnishing" must be a date',
      })
      .nullable()
  ),
  dateSubmittedToGardening: z.preprocess(
    (val) => checkInvalidValue(val, "Date Submitted To Gardening"),
    z
      .date({
        invalid_type_error: '"Date Submitted To Gardening" must be a date',
      })
      .nullable()
  ),
  dateExpectedGardeningCompletion: z.preprocess(
    (val) => checkInvalidValue(val, "Date Expected Gardening Completion"),
    z
      .date({
        invalid_type_error:
          '"Date Expected Gardening Completion" must be a date',
      })
      .nullable()
  ),
  dateCompletedGardening: z.preprocess(
    (val) => checkInvalidValue(val, "Date Completed Gardening"),
    z
      .date({
        invalid_type_error: '"Date Completed Gardening" must be a date',
      })
      .nullable()
  ),
  dateSubmitedToCommittee: z.preprocess(
    (val) => checkInvalidValue(val, "Date Submited To Committee"),
    z
      .date({
        invalid_type_error: '"Date Submited To Committee" must be a date',
      })
      .nullable()
  ),
  submissionStatus: z
    .nativeEnum(HouseSubmissionStatus)
    .optional()
    .default(HouseSubmissionStatus.NOT_STARTED),
  satisfactionStatus: z
    .preprocess((val) => {
      if (typeof val === "string" || val instanceof String) {
        try {
          return HouseSatisfactionStatus[
            val as keyof typeof HouseSatisfactionStatus
          ];
        } catch {
          return HouseSatisfactionStatus.NONE;
        }
      } else {
        return HouseSatisfactionStatus.NONE;
      }
    }, z.nativeEnum(HouseSatisfactionStatus))
    .default("NONE"),
  comment: z.preprocess((val) => {
    if (
      (typeof val === "string" || val instanceof String) &&
      val.trim() !== ""
    ) {
      return val.trim();
    } else {
      return null;
    }
  }, z.string({ invalid_type_error: "Comment must be a string" }).nullable()),
});

class InvalidDateError extends Error {
  constructor(fieldName: string) {
    super(`"${fieldName}" must be either empty or "N/A" or a date`);
    this.name = "InvalidDateError";
  }
}

/**
 * @description
 * Preprocesses the value to check if it is a valid date or empty or "N/A"
 *
 * preprocessing here is needed to check if the value is a valid date or empty or "N/A"
 * and notify the user accordingly
 * @throws {ZodError} if the value is not a valid date or empty or "N/A"
 * @param value
 * @param fieldName
 * @returns {Date | null} if the value is empty or "N/A" then returns null else returns the date
 */
// TODO properly validate if the data is not parsable as a date or null because if not it will set it to null
const checkInvalidValue = (value: unknown, fieldName: string) => {
  if (value instanceof Date) {
    return value;
  } else if (typeof value === "string" || value instanceof String) {
    const trimmedValue = value.trim();
    if (trimmedValue === "" || trimmedValue === "N/A") {
      return null;
    } else {
      try {
        return new Date(trimmedValue);
      } catch {
        throw new ZodError([
          {
            code: ZodIssueCode.invalid_type,
            expected: "date",
            received: "string",
            path: [fieldName],
            message: new InvalidDateError(fieldName).message,
          },
        ]);
      }
    }
  } else if (value === null || typeof value === "undefined") {
    return null;
  }
};

export type ZodHouseUnit = z.infer<typeof zodHouseUnitSchema>;
