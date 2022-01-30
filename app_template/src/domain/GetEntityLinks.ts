import { IEntityLink } from 'src/qiksar/qikflow/base/IEntityLink';
import EntitySchema from '../qiksar/qikflow/base/EntitySchema';

export default function getEntityLinks(): IEntityLink[] {
  const links: IEntityLink[] = [];

  EntitySchema.Schemas.map((s: EntitySchema) => {
    links.push(
      {
        title: s.Label,
        caption: `View ${s.Label}`,
        icon: s.Icon,
        link: `/${s.EntityName}`
      }
    );
  });

  return links;
}
