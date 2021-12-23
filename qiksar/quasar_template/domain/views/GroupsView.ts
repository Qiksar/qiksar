import Query, { GqlRecord, GqlRecords } from '../qikflow/base/Query'
import EntitySchema from '../qikflow/base/EntitySchema';

class GroupsView extends Query {
    constructor(sort_by: string | undefined = undefined, asc = true, limit: number | undefined = undefined) {

        const schema: EntitySchema = EntitySchema
            .Create('groups', 'group_id', 'Membership Groups')
            .Field('name', 'Group Name')
            .Field('state', 'State')
            .Include('members', 'leader_id','leader', 'member_id firstname lastname')
            .Flatten('leader.firstname leader.lastname', 'Leader Name')

        super(schema, true, sort_by, asc, limit)

        // eslint-disable-next-line @typescript-eslint/unbound-method
        super.SelectionsFunction = this.GetSelections;
    }

    
	GetSelections(rows: GqlRecords): GqlRecords {

		const selections = [] as GqlRecords;
		rows.map((r: GqlRecord) => {

			selections.push({
				id: r.group_id as number,
				label: r.name,
                description:r.state
			});

		});

        //console.log(JSON.stringify(selections));

		return selections;
	}
	
}

const view = new GroupsView();
export default view;		
