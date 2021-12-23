import Query from '../qikflow/base/Query'
import EntitySchema from '../qikflow/base/EntitySchema';

 class StatusView extends Query {
    constructor(sort_by: string|undefined = undefined, asc = true, limit:number|undefined = undefined) {
       
        const schema: EntitySchema = EntitySchema
        .CreateEnum('status', 'status_id', 'Status');
  
        super(schema, true, sort_by, asc, limit)

        // eslint-disable-next-line @typescript-eslint/unbound-method
        super.SelectionsFunction = super.GetEnumSelections;
    }
} 

const view =  new StatusView();
export default view;		
