import IDomainDefinition from 'src/qiksar/qikflow/base/IDomainDefinition';
import article from './entities/article';
import group from './entities/group';
import member from './entities/member';
import tag from './entities/tag';
import article_status from './enums/article_status';
import locale from './enums/locale';
import member_role from './enums/member_role';
import member_status from './enums/member_status';
import tenant from './enums/tenant';
import joins from './joins';

const definition: IDomainDefinition = {
  enums: [tenant, locale, member_status, member_role, article_status],
  entities: [article, tag, member, group],
  joins,
};

export default definition;
