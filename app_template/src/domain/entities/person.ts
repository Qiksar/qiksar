import { onGrid } from 'src/qiksar/qikflow/base/fieldOptions';
import IFieldDefinition from 'src/qiksar/qikflow/base/IFieldDefinition';

const firstname: IFieldDefinition = {
  name: 'firstname',
  label: 'First Name',
  column: 'firstname',
  editor: 'EntityEditText',
  options: onGrid,
};

const lastname: IFieldDefinition = {
  name: 'lastname',
  label: 'Surame',
  column: 'lastname',
  editor: 'EntityEditText',
  options: onGrid,
};

const email: IFieldDefinition = {
  name: 'email',
  type: 'email',
  label: 'Email Address',
  column: 'email',
  editor: 'EntityEditText',
  options: onGrid,
};

const mobile: IFieldDefinition = {
  name: 'mobile',
  type: 'mobile',
  label: 'Mobile Number',
  column: 'mobile',
  editor: 'EntityEditText',
  options: onGrid,
};

const photo: IFieldDefinition = {
  name: 'photo',
  type: 'image',
  label: 'Profile Photo',
  column: 'photo',
  editor: 'EntityEditImage',
};

const person = [firstname, lastname, email, mobile, photo];
export default person;
