import fs from 'fs';

export default function deleteFiles(stl: string,printerDefinition:string, gcode:string): boolean {
  try {
    fs.unlinkSync(stl);
    fs.unlinkSync(printerDefinition);
    //check if the gcode file exists
    fs.access(gcode, fs.constants.F_OK, (err) => {
      if (!err) {
        fs.unlinkSync(gcode);
      }
    });
    return true;  
  } catch (error) {
    return false;
  }
}