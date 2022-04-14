import IJoinDefinition from 'src/qiksar/qikflow/base/IJoinDefinition';
import IDomainDefinition from 'src/qiksar/qikflow/base/IDomainDefinition';
import article from './entities/article';
import group from './entities/group';
import chart from './entities/chart';
import member from './entities/member';
import tag from './entities/tag';
import article_status from './enums/article_status';
import locale from './enums/locale';
import member_role from './enums/member_role';
import member_status from './enums/member_status';
import tenant from './enums/tenant';
import joins from './joins';
import IEnumDefinition from 'src/qiksar/qikflow/base/IEnumDefinition';
import IEntityDefinition from 'src/qiksar/qikflow/base/IEntityDefinition';

/**
 * Define the application data domain
 *
 * Enums:     Simple data types with a label and description
 * Entities:  Complex data types
 * Joins:     Many to many relationships between Entities
 *
 */
class domainDefinition implements IDomainDefinition {
  public get enums(): IEnumDefinition[] {
    return [tenant, locale, member_status, member_role, article_status];
  }

  public get entities(): IEntityDefinition[] {
    return [article, tag, member, group, chart];
  }

  public get joins(): IJoinDefinition[] {
    return joins;
  }

  /**
   * Fetch a many to many join definition by name
   *
   * @param name name of the join to fetch
   * @returns
   */
  GetJoin(name: string): IJoinDefinition {
    name = name.toLowerCase().trim();

    const joins = this.joins.filter((j) => name === j.source);

    if (joins && joins.length > 0) {
      return joins[0];
    }

    throw `Error - Specified join '${name}' does not exist in domain`;
  }
}

const domain = new domainDefinition();
export default domain;
