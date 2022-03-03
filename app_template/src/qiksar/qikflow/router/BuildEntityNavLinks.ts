import IEntityLink from 'src/qiksar/qikflow/base/IEntityLink';
import EntityDefinition from 'src/qiksar/qikflow/base/EntityDefinition';

export default function BuildEntityNavLinks(): IEntityLink[] {
  const links: IEntityLink[] = [];

  EntityDefinition.Entities.map((s: EntityDefinition) => {
    links.push({
      title: s.Label,
      caption: `View ${s.Label}`,
      icon: s.Icon,
      link: `/${s.EntityName}`,
    });
  });

  return links;
}
