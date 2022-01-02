import Query from '../qikflow/base/Query'
import EntitySchema from '../qikflow/base/EntitySchema';

class TenantsView extends Query {
    constructor() {
       
        const schema: EntitySchema = EntitySchema.CreateEnum(
            'tenants', 
            'tenant_id', 
            'Tenant'
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

const view = new TenantsView();
export default view;		