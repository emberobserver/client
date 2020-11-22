const FILENAME_REGEX = /([^/]+)(\.|-)\w+\.([^.]+)$/;

export default function normalizeFingerprintedAsset(originalFilename) {
  if (!originalFilename) {
    return '';
  }

  let filenameParts = originalFilename.match(FILENAME_REGEX);
  let normalizedFilename = originalFilename;

  if (filenameParts && filenameParts.length >= 3) {
    normalizedFilename = `${filenameParts[1]}.${filenameParts[3]}`;
  }

  return normalizedFilename;
}
