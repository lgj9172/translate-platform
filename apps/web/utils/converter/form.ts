export const objectToFormData = <T extends object>(object: T) => {
  const formData = new FormData();

  Object.entries(object).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
    } else if (value === "") {
      formData.append(key, "");
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};
