import Query from '../qikflow/base/Query'
import EntitySchema from '../qikflow/base/EntitySchema';

class GroupsView extends Query {
    constructor(sort_by: string | undefined = undefined, asc = true, limit: number | undefined = undefined) {

        const schema: EntitySchema = EntitySchema.Create(
            'groups', 
            'group_id', 
            'Membership Groups'
            )
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

        super(schema, true, sort_by, asc, limit)
    }

	
}

const view = new GroupsView();
export default view;		
