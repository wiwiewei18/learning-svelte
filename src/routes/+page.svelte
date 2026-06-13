<script lang="ts">
	import { DataTable, defineDataTable } from '$lib';

	type User = {
		name: string;
		job: string;
		company: string;
		location: string;
		favoriteColor: string;
		lastLogin: string;
	};

	const table = defineDataTable<User>({
		columns: [
			{ key: 'name', label: 'Name', showFilter: true, showManageColumn: false },
			{ key: 'job', label: 'Job', showFilter: true, showManageColumn: false },
			{ key: 'company', label: 'Company', showFilter: true, showManageColumn: false },
			{ key: 'location', label: 'Location', showFilter: true, showManageColumn: false },
			{ key: 'favoriteColor', label: 'Favorite Color', showFilter: false, showManageColumn: true },
			{ key: 'lastLogin', label: 'Last Login', showFilter: false, showManageColumn: true }
		],
		rows: [
			{
				name: 'Ari Nugroho',
				job: 'Frontend Engineer',
				company: 'Nusa Digital',
				location: 'Indonesia',
				favoriteColor: 'Blue',
				lastLogin: '2026-05-03'
			},
			{
				name: 'Mika Tanaka',
				job: 'Product Designer',
				company: 'Kumo Labs',
				location: 'Japan',
				favoriteColor: 'Green',
				lastLogin: '2026-05-01'
			},
			{
				name: 'Raka Pratama',
				job: 'QA Engineer',
				company: 'Orbit Systems',
				location: 'Singapore',
				favoriteColor: 'Orange',
				lastLogin: '2026-05-04'
			},
			{
				name: 'Sarah Coleman',
				job: 'Data Analyst',
				company: 'Northwind',
				location: 'United States',
				favoriteColor: 'Purple',
				lastLogin: '2026-04-30'
			},
			{
				name: 'David Chen',
				job: 'Backend Developer',
				company: 'TechFlow',
				location: 'Taiwan',
				favoriteColor: 'Red',
				lastLogin: '2026-05-04'
			},
			{
				name: 'Emma Watson',
				job: 'UX Designer',
				company: 'Design Hub',
				location: 'UK',
				favoriteColor: 'Pink',
				lastLogin: '2026-05-02'
			},
			{
				name: 'Raj Patel',
				job: 'DevOps Engineer',
				company: 'Cloud Systems',
				location: 'India',
				favoriteColor: 'Cyan',
				lastLogin: '2026-05-05'
			},
			{
				name: 'Lisa Anderson',
				job: 'Project Manager',
				company: 'Enterprise Solutions',
				location: 'Canada',
				favoriteColor: 'Teal',
				lastLogin: '2026-04-29'
			},
			{
				name: 'Carlos Martinez',
				job: 'Security Engineer',
				company: 'SecureNet',
				location: 'Mexico',
				favoriteColor: 'Yellow',
				lastLogin: '2026-05-03'
			},
			{
				name: 'Sophie Laurent',
				job: 'ML Engineer',
				company: 'AI Innovations',
				location: 'France',
				favoriteColor: 'Indigo',
				lastLogin: '2026-05-05'
			}
		]
	});
</script>

<DataTable title="All Users" columns={table.columns} rows={table.rows} />
