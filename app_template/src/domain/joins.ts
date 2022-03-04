import IManyToManyJoin from 'src/qiksar/qikflow/base/IManyToManyJoin';

const article_tags: IManyToManyJoin = {
  table: 'article_tags',
  master_entity: 'articles',
  secondary_entity: 'tags',
};

const joins: IManyToManyJoin[] = [article_tags];
export default joins;
