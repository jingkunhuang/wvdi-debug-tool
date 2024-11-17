import constants from '@/utils/constants'

export function getLogTimeRange(lines) {
  let time_begin = undefined;
  let time_end = undefined;

  // set time_begin to the time of the first log line that has a timestamp
  for (let i = 0; i < lines.length; i++) {
    let time_match = lines[i].match(constants.REGEX_TIMESTAMP);
    if (time_match) {
      time_begin = new Date(time_match[0]);
      break;
    }
  }

  // set time_end to the time of the last log line that has a timestamp
  for (let i = lines.length - 1; i >= 0; i--) {
    let time_match = lines[i].match(constants.REGEX_TIMESTAMP);
    if (time_match) {
      time_end = new Date(time_match[0]);
      break;
    }
  }

  return [ time_begin, time_end ];
}

export function filterToTimeRange(lines, time_begin, time_end) {
  return lines.filter((line) => {
    let time_match = line.match(constants.REGEX_TIMESTAMP);
    if (time_match) {
      let time = new Date(time_match[0]);
      return time >= time_begin && time <= time_end;
    }
    return false;
  });
}
