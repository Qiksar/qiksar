/* eslint-disable @typescript-eslint/no-explicit-any */

import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';
import IFieldDefinition from 'src/qiksar/qikflow/base/IFieldDefinition';

const firstname: IFieldDefinition = {
  name: 'firstname',
  label: 'First Name',
  column: 'firstname',
  editor: 'EntityEditText',
  options: onGrid,
  placeholder: 'First name (e.g. Bill)',
  helpText: 'Enter name with at least 4 characters',
  autofocus: true,
  validationRules: {
    required: true,
    minLength: 4,
    maxLength: 30,
  },
};

const lastname: IFieldDefinition = {
  name: 'lastname',
  label: 'Surame',
  column: 'lastname',
  editor: 'EntityEditText',
  options: onGrid,
  placeholder: 'Enter surname (last name or family name)',
  helpText: 'Enter name with at least 4 characters',
  validationRules: {
    required: true,
    minLength: 4,
    maxLength: 40,
  },
};

const email: IFieldDefinition = {
  name: 'email',
  type: 'email',
  label: 'Email Address',
  column: 'email',
  editor: 'EntityEditText',
  options: onGrid,
  helpText: 'Enter an email address',
  placeholder: 'Email address',
  validationRules: { required: true },
};

const mobile: IFieldDefinition = {
  name: 'mobile',
  type: 'mobile',
  label: 'Mobile Number',
  column: 'mobile',
  editor: 'EntityEditText',
  options: onGrid,
  helpText: 'Enter a mobile phone number',
  placeholder: 'Mobile number',
};

const photo: IFieldDefinition = {
  name: 'photo',
  type: 'image',
  label: 'Profile Photo',
  column: 'photo',
  editor: 'EntityEditImage',
  helpText: 'Select an image or take a photo',
  placeholder: 'Image',
};

const person = [firstname, lastname, email, mobile, photo];
export default person;
