import IEntityLink from 'src/qiksar/qikflow/base/IEntityLink';
import EntitySchema from 'src/qiksar/qikflow/base/EntitySchema';

export default function BuildEntityNavLinks(): IEntityLink[] {
  const links: IEntityLink[] = [];

  EntitySchema.Schemas.map((s: EntitySchema) => {
    links.push({
      title: s.Label,
      caption: `View ${s.Label}`,
      icon: s.Icon,
      link: `/${s.EntityName}`,
    });
  });

  return links;
}
