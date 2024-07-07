export const singleISODate = (date) => {
  let createdAt = date;
  let newISODate = createdAt.toISOString().slice(0,10);
  return newISODate;
};