export function convertToSeconds(duration: string): number {
    const parts = duration.split(":").map(Number);
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (parts.length === 3) {
      [hours, minutes, seconds] = parts;
    } 
    else if (parts.length === 2) {
        [minutes, seconds] = parts;
    } 

 
    return (hours * 3600 + minutes * 60 + seconds)



}