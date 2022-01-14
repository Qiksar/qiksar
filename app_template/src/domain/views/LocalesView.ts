import Query from '../../qiksar/qikflow/base/Query'
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class RoleView extends Query {
    constructor() {
       
        const schema: EntitySchema = EntitySchema.Create(
            'locales', 
            'name', 
            'Locale'
            )
			.Field('name', 'Locale ID')
			.Field('comment', 'Description')
            .ToSelection((r) => { 
                    return {
                        id: r[this.Schema.Key],
                        label: r.name as string,
                        description: r.comment as string,
                    }
                });

        super(schema, true)
    }
} 

const view = new RoleView();
export default view;		