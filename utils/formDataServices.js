export const createUpdateTicketCommentForm = (formData) => {
  let data = new FormData();
  formData.message && data.append("message", formData.message);
  formData.upload && data.append("upload", formData.upload);
  return data;
};