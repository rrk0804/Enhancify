function getID(uri: string): string {
  return uri.split(":")[2];
}

export default getID;
