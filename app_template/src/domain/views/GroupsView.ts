import Query from '../../qiksar/qikflow/base/Query'
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class GroupsView extends Query {
    constructor() {

        const schema: EntitySchema = EntitySchema.Create(
            'groups', 
            'group_id', 
            'Membership Groups'
            )
            
            .UseEnum('tenants', 'tenant_id', 'tenant')
            
            .Field('name', 'Group Name')
            .Field('state', 'State')
 
            .Include('members', 'leader_id','leader', 'member_id firstname lastname')
            .Flatten('leader.firstname leader.lastname', 'Leader Name')

            .ToSelection((r) => { 
                    return {
                        id: r.group_id as number,
                        label: r.name,
                        description:r.state
                    }
                });

        super(schema, true)
    }
}

const view = new GroupsView();
export default view;		
