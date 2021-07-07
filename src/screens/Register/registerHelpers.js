import {phoneReg, emailReg, onlyLettersReg} from '../../utils';

export const checkErrors = (
  setErrors,
  phone,
  password,
  repeatedPassword,
  email,
  firstName,
  lastName,
) => {
  let errorOccured;
  if (phone.length < 10) {
    setErrors(prev => ({
      ...prev,
      phone: 'Phone number missing digits',
    }));
    errorOccured = true;
  } else {
    setErrors(prev => ({...prev, phone: null}));
  }
  if (phoneReg.test(phone) || phone.length < 10) {
    setErrors(prev => ({...prev, phone: 'Phone not valid'}));
    errorOccured = true;
  } else {
    setErrors(prev => ({...prev, phone: null}));
  }
  if (password.length < 6) {
    setErrors(prev => ({...prev, password: 'Password too short'}));
    errorOccured = true;
  } else if (password !== repeatedPassword) {
    const errorMsg = 'Passwords not matched';
    setErrors(prev => ({
      ...prev,
      password: errorMsg,
      repeatedPassword: errorMsg,
    }));
    errorOccured = true;
  } else {
    setErrors(prev => ({...prev, password: null, repeatedPassword: null}));
  }
  if (email.length < 5 || !emailReg.test(email)) {
    setErrors(prev => ({
      ...prev,
      email: 'Email not valid',
    }));
    errorOccured = true;
  } else {
    setErrors(prev => ({
      ...prev,
      email: null,
    }));
  }
  if (firstName.length < 2 || !onlyLettersReg.test(firstName)) {
    setErrors(prev => ({
      ...prev,
      firstName: 'First name not valid',
    }));
    errorOccured = true;
  } else {
    setErrors(prev => ({
      ...prev,
      firstName: null,
    }));
  }
  if (lastName.length < 2 || !onlyLettersReg.test(lastName)) {
    setErrors(prev => ({
      ...prev,
      lastName: 'First name not valid',
    }));
    errorOccured = true;
  } else {
    setErrors(prev => ({
      ...prev,
      lastName: null,
    }));
  }

  return errorOccured;
};
