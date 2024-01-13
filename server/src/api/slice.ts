import slicerInformation from "../../sliceInformation.json";
import { APP_DIR } from "../constants";
import { execSync } from "child_process";
import fs from "fs";
import stl from "stl";

const getSlicerInformation = (): string => {
  const slicerInfo = slicerInformation as unknown as { [key: string]: string | number | boolean };
  return Object.entries(slicerInfo).map((slicer) => {
    return `-s ${Object.keys(slicer)} = ${slicer}`
  }).join()
}

const isStlFileValid = (filePath: string): boolean => {
  try {
    const stlData: string = fs.readFileSync(filePath).toString();
    stl.toObject(stlData)
    return true; // If parsing is successful, the STL file is considered valid
  } catch (error) {
    console.error('invalid Stl', (error as Error).message as string);
    return false; // If an error occurs during parsing, the STL file is considered invalid
  }
};

const sliceModel = (
  filePath: string,
  printer_def: string = "../../../printerDefinitions/ultimaker3.def.json" as string,
): Promise<void | Error> => {
  return new Promise<void | Error>(
    (resolve: (result: void) => void, _reject: (error: Error) => void): void => {
      if (!isStlFileValid(filePath)) {
        // reject(new Error("Invalid STL file"));
      }
      const outputPath = `${APP_DIR}/outputs/${filePath.split(".")[0]}.gcode`;
      console.log(outputPath);
      const output:string = execSync(
        `CuraEngine slice -v -p -j ${printer_def} -o ${outputPath} ${getSlicerInformation()} -l ${filePath}/${filePath}`,
        { encoding: "utf-8" }
      ); // the default is 'buffer'
      console.log(output);
      resolve();
    }
  );
};

export default sliceModel;
