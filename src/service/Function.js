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

export const getBase64Image = async uri => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64String = reader.result.replace(
          /^data:image\/(png|jpeg|jpg);base64,/,
          '',
        );
        resolve(`data:image/png;base64,${base64String}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw error;
  }
};
