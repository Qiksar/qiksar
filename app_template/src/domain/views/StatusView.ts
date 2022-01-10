import Query from '../../qiksar/qikflow/base/Query'
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

 class StatusView extends Query {
    constructor() {
       
        const schema: EntitySchema = EntitySchema.CreateEnum(
            'status', 
            'status_id', 
            'Status'
            )
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

const view =  new StatusView();
export default view;		
