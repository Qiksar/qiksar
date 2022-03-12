import IJoinDefinition from 'src/qiksar/qikflow/base/IJoinDefinition';

const article_tags: IJoinDefinition = {
  source: 'article_tags',
  master_entity: 'articles',
  master_key: 'article_id',
  secondary_entity: 'tags',
  secondary_key: 'tag_id',
};

const joins: IJoinDefinition[] = [article_tags];
export default joins;
