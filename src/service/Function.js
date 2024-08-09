export const validateForm = (fieldsToValidate, formData, setFormErrors) => {
  let valid = true;
  const newErrors = {};

  fieldsToValidate.forEach(field => {
    if (!formData[field]) {
      newErrors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } est obligatoire`;
      valid = false;
    } else {
      newErrors[field] = '';
    }
  });

  setFormErrors(newErrors);
  return valid;
};
