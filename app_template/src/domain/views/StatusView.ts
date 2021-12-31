import Query from '../qikflow/base/Query'
import EntitySchema from '../qikflow/base/EntitySchema';

 class StatusView extends Query {
    constructor() {
       
        const schema: EntitySchema = EntitySchema.CreateEnum(
            'status', 
            'status_id', 
            'Status'
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

const view =  new StatusView();
export default view;		
