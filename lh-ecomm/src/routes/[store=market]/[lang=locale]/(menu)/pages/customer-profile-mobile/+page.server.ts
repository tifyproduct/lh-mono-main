import type { LayoutServerLoad } from '../../../(pages)/$types';
import type { CustomerProfile } from '$lib/types/customer';
import { getUserById } from '$lib/server/collections/user';
import { error } from '@sveltejs/kit';


export const load: LayoutServerLoad = async ({ locals }) => {

	let customer: CustomerProfile | undefined;
	const userId = locals?.userId
	if (userId) {
		try {
			const user = await getUserById(userId)
			
			customer = {
				id: user?.shopifyId,
				firstName: user?.firstName,
				lastName: user?.lastName,
				email: user?.email,
				phone: user?.phone,
				isLoggedIn: true
			} as CustomerProfile
		} catch (err) {
			error(500, err instanceof Error ? err.message : "Internal Server Error");
		}
	}

	return {
		customer: customer,
		seo: {
			title: 'Customer Profile - Luxehouze Indonesia',
			metaDescription: 'Luxury Marketplace'
		}
	};
};
// end of register and login
