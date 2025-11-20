import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase }, cookies }) => {
	const { session, user } = await safeGetSession();
	
	let profile = null;
	if (user) {
		const { data } = await supabase
			.from('profile')
			.select('name')
			.eq('id_auth', user.id)
			.single();
		
		if (data) {
			profile = {
				name: data.name,
				email: user.email || ''
			};
		}
	}
	
	return {
		session,
		profile,
		cookies: cookies.getAll()
	};
};
