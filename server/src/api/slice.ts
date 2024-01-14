import slicerInformation from "../../sliceInformation.json";
import { APP_DIR } from "../constants";
// import { execSync } from "child_process";
import { spawn } from 'child_process';
// import fs from "fs";
// import stl from "stl";

const getSlicerInformation = (): string => {
  const slicerInfo = slicerInformation as unknown as { [key: string]: string | number | boolean };
  
  return Object.keys(slicerInfo).map((slicer) => {
    return `-s ${slicer}=${slicerInfo[slicer]}`
    
  }).join(" ");
}

// const isStlFileValid = (filePath: string): boolean => {
//   try {
//     const stlData: string = fs.readFileSync(filePath).toString();
//     stl.toObject(stlData)
//     return true; // If parsing is successful, the STL file is considered valid
//   } catch (error) {
//     console.error('invalid Stl', (error as Error).message as string);
//     return false; // If an error occurs during parsing, the STL file is considered invalid
//   }
// };

const sliceModel = (
  fileName: string,
  printer_def: string = `../printerDefinitions/ultimaker_s3.def.json` as string,
): Promise<void | Error> => {
  return new Promise<void | Error>(
    (resolve: (result: void) => void, reject: (error: Error) => void): void => {
      const filePath = `${APP_DIR}/../uploads/${fileName}`;
      
      // if (!isStlFileValid(filePath)) {
      //   reject(new Error("Invalid STL file"));
      //   console.log("Invalid STL file");
      //   return;
      // }

      const outputPath = `${APP_DIR}/../outputs/${fileName.split(".")[0]}.gcode`;

      const slicerProcess = spawn('CuraEngine', [
        'slice',
        '-p',
        '-j',
        printer_def,
        '-o',
        outputPath,
        ...getSlicerInformation().split(' '),
        '-l',
        filePath,
      ]);

      slicerProcess.stdout.on('data', (data) => {
        console.error(data.toString());
        reject(new Error(data.toString())); 
      });
      
      slicerProcess.stderr.on('data', (data) => {
        const output = data.toString();
        if (output.includes("Progress")) {
          // split at index of % -5 to remove the percentage and the newline
          const progress:number = output.split("%")[0].slice(-8) as unknown as number;
          console.log(progress);

        }
      });

      slicerProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Slicer process exited with code ${code}`));
        }
      });
    }
  );
};


export default sliceModel;
