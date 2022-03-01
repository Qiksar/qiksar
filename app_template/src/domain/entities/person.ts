/* eslint-disable @typescript-eslint/no-explicit-any */

import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';
import IFieldDefinition from 'src/qiksar/qikflow/base/IFieldDefinition';
import { t } from 'src/qiksar/Translator/Translator';

const isRequired = (v: any) => !!v || t('A value is required');

function minLength(l: number, v: any) {
  return (
    (v as string).length >= l ||
    t('The minimum number of characters is') + `: ${l}`
  );
}

const nameRules = [isRequired, (v: any) => minLength(4, v)];

const nameValidation = {
  quasar_validation_rules: nameRules,
};

const firstname: IFieldDefinition = {
  name: 'firstname',
  label: 'First Name',
  column: 'firstname',
  editor: 'EntityEditText',
  options: onGrid,
  placeholder: 'First name (e.g. Bill)',
  helpText: 'Enter name with at least 4 characters',
  autofocus: true,
  validation: nameValidation,
};

const lastname: IFieldDefinition = {
  name: 'lastname',
  label: 'Surame',
  column: 'lastname',
  editor: 'EntityEditText',
  options: onGrid,
  placeholder: 'Enter surname (last name or family name)',
  helpText: 'Enter name with at least 4 characters',
  validation: nameValidation,
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
