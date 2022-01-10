import Query from '../../qiksar/qikflow/base/Query'
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class RoleView extends Query {
    constructor() {
       
        const schema: EntitySchema = EntitySchema.CreateEnum(
            'roles', 
            'role_id', 
            'Role'
            );

        super(schema, true)
    }
} 

const view = new RoleView();
export default view;		