export const isTokenExpired = (expirationDate: Date, ttlHours = 24): boolean => {
  const now = Date.now();
  const expirationTime = new Date(expirationDate).getTime();
  const ttlMilliseconds = ttlHours * 60 * 60 * 1000;
  
  return now - expirationTime > ttlMilliseconds;
};
