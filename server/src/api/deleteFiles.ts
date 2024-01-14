import fs from 'fs';

export default function deleteFiles(stl: string, gcode:string|null): boolean {
  try {
    fs.unlinkSync(stl);
    if (gcode)fs.unlinkSync(gcode);
    return true;
  } catch (error) {
    return false;
  }
}