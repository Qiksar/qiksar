import ISchemaDefinition from 'src/qiksar/qikflow/base/ISchemaDefinition';
import article from './entities/article';
import group from './entities/group';
import member from './entities/member';
import article_status from './enums/article_status';
import locale from './enums/locale';
import member_role from './enums/member_role';
import member_status from './enums/member_status';
import tenant from './enums/tenant';

const schema: ISchemaDefinition = {
  enums: [tenant, locale, member_status, member_role, article_status],
  entities: [member, group, article],
};

export default schema;
