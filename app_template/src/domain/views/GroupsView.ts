import Query from '../../qiksar/qikflow/base/Query'
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class GroupsView extends Query {
    constructor() {

        const schema: EntitySchema = EntitySchema.Create(
            'groups', 
            'group_id', 
            'Membership Groups'
            )
            
            .Field('name', 'Group Name')
            .Field('state', 'State')
 
            .Fetch('members', 'leader_id', 'leader', 'member_id firstname lastname')
            .Flatten('leader.firstname leader.lastname', 'Leader Name')

            .TransformWith((r) => { 
                    return {
                        id: r[this.Schema.Key],
                        label: r.name,
                        description:r.state
                    }
                });

        super(schema, true)
    }
}

const view = new GroupsView();
export default view;		
