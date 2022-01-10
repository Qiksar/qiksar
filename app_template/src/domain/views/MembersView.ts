import Query from '../../qiksar/qikflow/base/Query'
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class MemberView extends Query {
	constructor() {
		const schema: EntitySchema = EntitySchema.Create(
			'members',
			'member_id',
			'Member'
			)

			.Field('firstname', 'First Name', 'text')
			.Field('lastname', 'Surame')
			.Field('email', 'Email Address', 'email')
			.Field('mobile', 'Mobile Number', 'mobile')
			.Field('photo', 'Profile Photo', 'image', ['heavy'])
			.Field('rating', 'Member Rating', 'number', ['EntityEditLichert'])
			.Include('groups', 'group_id', 'group', 'group_id name state')
			.Flatten('group.name', 'Group')
			.Flatten('group.state', 'State')
			.UseEnum('roles', 'role')
			.UseEnum('status', 'status')
			.ToSelection((r) => { 
					return {
						id: r.member_id, 
						label: (r.firstname as string) + ' ' + (r.lastname as string), 
						description: (r.firstname as string) + ' ' + (r.lastname as string) 
						}
					}
				);

		super(schema);
	}
}

const view = new MemberView();
export default view;		
