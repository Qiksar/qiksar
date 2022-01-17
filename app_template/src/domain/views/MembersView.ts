import Query from '../../qiksar/qikflow/base/Query'
import EntitySchema from '../../qiksar/qikflow/base/EntitySchema';

class MembersView extends Query {
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
			.Field('photo', 'Profile Photo', 'image', ['heavy', 'EntityEditImage'])
			.Field('rating', 'Member Rating', 'number', ['EntityEditLichert'])
			.Fetch('groups', 'group_id', 'group', 'group_id name state')
			.Flatten('group.name', 'Group')
			.Flatten('group.state', 'State')
			.UseEnum('roles', 'role_id', 'role')
			.UseEnum('status', 'status_id', 'status')
			.UseEnum('locales', 'locale_id', 'locale')
			.TransformWith((r) => { 
					return {
                        id: r[this.Schema.Key],
						label: (r.firstname as string) + ' ' + (r.lastname as string), 
						description: (r.firstname as string) + ' ' + (r.lastname as string) 
						}
					}
				);

		super(schema);
	}
}

const view = new MembersView();
export default view;		
