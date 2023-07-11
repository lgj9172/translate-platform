export const objectToFormData = (object: any) => {
  const formData = new FormData();
  Object.entries(object).forEach(([key, value]) => {
    if (value === "") formData.append(key, "");
    else formData.append(key, String(value));
  });
  return formData;
};
