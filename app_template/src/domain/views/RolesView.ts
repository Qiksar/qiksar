import Query from '../qikflow/base/Query'
import EntitySchema from '../qikflow/base/EntitySchema';

class RoleView extends Query {
    constructor() {
       
        const schema: EntitySchema = EntitySchema.CreateEnum(
            'roles', 
            'role_id', 
            'Role'
            )
            .ToSelection((r) => { 
                    return {
                        id: r[this.Schema.Key] as number,
                        label: r.name as string,
                        description: r.comment as string,
                    }
                });

        super(schema, true)
    }
} 

const view = new RoleView();
export default view;		