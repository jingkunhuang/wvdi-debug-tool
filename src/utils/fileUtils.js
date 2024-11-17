
export function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target.result)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export function readFilesAsync(fileList) {
  return Promise.all(fileList.map(readFileAsync))
}
