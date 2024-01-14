import slicerInformation from "../../sliceInformation.json";
import { spawn } from 'child_process';

const getSlicerInformation = (): string => {
  const slicerInfo = slicerInformation as unknown as { [key: string]: string | number | boolean };
  
  return Object.keys(slicerInfo).map((slicer) => {
    return `-s ${slicer}=${slicerInfo[slicer]}`
    
  }).join(" ");
}

const sliceModel = (
  fileName: string,
  printer_def: string,
): Promise<void | Error> => {
  return new Promise<void | Error>(
    (resolve: (result: void) => void, reject: (error: Error) => void): void => {
      console.log(printer_def);
      // printer_def = `../printerDefinitions/ultimaker_s3.def.json` as string;
      printer_def = `uploads/${printer_def}` as string;
      const filePath:string = `uploads/${fileName}`;
      const outputPath:string = `outputs/${fileName.split(".")[0]}.gcode`;

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
          // TODO: ADD Websocket to send progress to client
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
