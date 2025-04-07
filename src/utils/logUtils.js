import constants from '@/utils/constants'
import { readFileAsync } from '@/utils/fileUtils'

export function getLogTime(line) {
  let time_match = line.match(constants.REGEX_TIMESTAMP);
  if (time_match) {
    return new Date(time_match[0]);
  }

  time_match = line.match(constants.REGEX_TIMESTAMP_VC);
  if (time_match) {
    time_match[0] = time_match[0].replace(/,/, '.');
    time_match[0] = time_match[0].replace(/ /, 'T');

    return new Date(time_match[0]);
  }

  return undefined;
}

export function getLogTimeRange(lines) {
  let time_begin = undefined;
  let time_end = undefined;

  // set time_begin to the time of the first log line that has a timestamp
  for (let i = 0; i < lines.length; i++) {
    let time = getLogTime(lines[i]);
    if (time) {
      time_begin = time;
      break;
    }
  }

  // set time_end to the time of the last log line that has a timestamp
  for (let i = lines.length - 1; i >= 0; i--) {
    let time = getLogTime(lines[i]);
    if (time) {
      time_end = time;
      break;
    }
  }

  return [ time_begin, time_end ];
}

export function filterToTimeRange(lines, time_begin, time_end) {
  return lines.filter((line) => {
    let time = getLogTime(line);
    if (time) {
      return time >= time_begin && time <= time_end;
    }
    return false;
  });
}


// merge log files, order by timestamp
export function mergeLogFiles(files) {
  const logs = files.map((file) => file.split('\n'))
  logs.sort((a, b) => {
    const timeA = getLogTime(a[0])
    const timeB = getLogTime(b[0])
    // show error if time is not found
    if (!timeA || !timeB) {
      console.error('Time not found in log file')
      return []
    }
    return timeA - timeB
  })

  return logs.flat()
}


export function readLogFiles(files) {
  return Promise.all(files.map(readFileAsync))
    .then((files) => mergeLogFiles(files))
}
