import Query from '../qikflow/base/Query'
import EntitySchema from '../qikflow/base/EntitySchema';

class MemberView extends Query {
	constructor(
		sort_by: string | undefined = undefined,
		asc = true,
		limit: number | undefined = undefined
	) {
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
			.UseEnum('roles', 'role_id', 'role')
			.UseEnum('status', 'status_id', 'status')
			.ToSelection((r) => { 
					return {
						id: r.member_id as number, 
						label: (r.firstname as string) + ' ' + (r.lastname as string), 
						description: (r.firstname as string) + ' ' + (r.lastname as string) 
						}
					}
				);

		super(schema, false, sort_by, asc, limit);
	}
}

const view = new MemberView();
export default view;		