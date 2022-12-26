export const createUpdateTicketCommentForm = (formData) => {
  console.log("servicing data")
  console.log(formData)
  console.log(formData.message)
  console.log("============")
  let data = new FormData();
  formData.message && data.append("message", formData.message);
  formData.upload && data.append("upload", formData.upload);
  console.log(data.getAll("message"))
  console.log(data.getAll("upload"))
  console.log(data)
  console.log("-=-=-=-=-=-=-")
  return data;
};