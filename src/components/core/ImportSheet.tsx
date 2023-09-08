import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetSection,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { getExcelTemplateFile, useImportExcel } from "~/utils/io-excel";
import { FileDown, PlusCircle } from "lucide-react";

import { ZodHouseUnit, zodHouseUnitSchema } from "../../utils/validation";

type Props = {
  // Custom props here
};

const ImportSheet = (props: Props) => {
  const { toast } = useToast();
  const [showInvalidData, setShowInvalidData] = React.useState(false);

  const { mutate: importData } = api.housing.importExcelFileData.useMutation();
  const queryClient = api.useContext();
  const { setFile, isProcessingFile, invalidRows } = useImportExcel({
    onSuccess: (data) => {
      // TODO check for duplicate units in the valid rows
      console.log(data);
      importData(
        {
          houseUnits: data,
        },
        {
          async onSuccess(data, variables, context) {
            await queryClient.housing.getHouseUnitsProcessedDays.invalidate();
            toast({
              title: "Import Success!",
              description: `${variables.houseUnits.length} Housing units imported successfully.`,
            });
          },
        }
      );
    },
    onFailedRows(invalidRows) {
      toast({
        title: "Import Error!",
        variant: "destructive",
        description: `Some rows are invalid. to see the invalid rows, click the button below.`,
        action: (
          <ToastAction
            altText="Import Faild, show invalid rows"
            onClick={() => setShowInvalidData(true)}>
            Show Invalid Rows
          </ToastAction>
        ),
      });
    },
    onError: (e) => {
      const errorMessage = e.message ?? "Internal Error";
      toast({
        title: "Import Error!",
        variant: "destructive",
        description: errorMessage,
        action: (
          <ToastAction altText="Import Faild" onClick={() => clickImport()}>
            Try Again
          </ToastAction>
        ),
      });
    },
  });

  const clickImport = () => {
    const input = document.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;
    input.click();
  };

  return (
    <AlertDialog open={showInvalidData}>
      <AlertDialogTrigger asChild>
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" type="button">
              <PlusCircle className="mr-2" /> Import
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Are you ready?</SheetTitle>
              <SheetDescription>
                The import process will require you to fill a simple template
                file, and then import it.
                <div className="mb-1" />
                This is important to make sure that the data you are entering is
                in valid order and naming.
              </SheetDescription>
            </SheetHeader>

            <Separator className="my-4" />

            <SheetSection>
              <SheetTitle>Do you have the template?</SheetTitle>
              <SheetDescription>
                The template is a file that contains the required columns and
                headers for the import process.
                <div className="mb-1" />
                If you don&apos;t have the template, you can download it using
                the button below, fill it with the data you want to import, and
                then import it.
              </SheetDescription>
              <Button
                className="w-full"
                variant="outline"
                type="button"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  await getExcelTemplateFile();
                }}>
                <FileDown className="mr-2" /> Download Template
              </Button>
            </SheetSection>

            <Separator className="my-4" />

            <SheetSection>
              <div className="items-top flex space-x-2">
                <p className="text-sm text-muted-foreground">
                  This operation will try to match the data you are importing
                  with the existing data in the database through the unit
                  number.
                  <br />
                  <br />
                  In case of a match, the existing data will be replaced with
                  the new data.
                  <br />
                  <br />
                  However, if a new unit number is found, it will be added to
                  the already existing data.
                </p>
              </div>
              <Button
                className="w-full"
                variant="outline"
                type="button"
                onClick={() => clickImport()}>
                <input
                  type="file"
                  multiple={false}
                  hidden
                  accept=".xls,.xlsx"
                  onChange={(value) => {
                    if (!value.target.files || !value.target.files[0]) return;
                    const file = value.target.files[0];
                    value.target.value = "";
                    setFile(file);
                  }}
                />
                <PlusCircle className="mr-2" /> Import
              </Button>
            </SheetSection>
          </SheetContent>
        </Sheet>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Invalid Rows Data</AlertDialogTitle>
          <AlertDialogDescription>
            This is a breakdown of the invalid rows data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* show "row number: error message" in a nice formatted way */}
        <ScrollArea className="overflow-y-auto max-h-96">
          {invalidRows.map((row, index) => (
            <div key={index} className="flex flex-row">
              <div className="w-1/6">{JSON.stringify(row.data)}</div>
              <div className="w-5/6">{row.message}</div>
            </div>
          ))}
        </ScrollArea>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setShowInvalidData(false)}>
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ImportSheet;
