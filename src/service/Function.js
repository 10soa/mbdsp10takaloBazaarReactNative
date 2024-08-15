export const validateForm = (
  fieldsToValidate,
  formData,
  setFormErrors,
  translate = undefined,
) => {
  let valid = true;
  const newErrors = {};

  fieldsToValidate.forEach(field => {
    if (!formData[field]) {
      if (translate) {
        newErrors[field] = translate(field) + ' est obligatoire';
      } else {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } est obligatoire`;
      }
      valid = false;
    } else {
      newErrors[field] = '';
    }
  });

  setFormErrors(newErrors);
  return valid;
};
