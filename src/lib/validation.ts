import z from 'zod';

export const NewGroupSchema = z
	.string({ required_error: 'Group name required' })
	.min(2, { message: 'Group name length must be >= 2' })
	.max(20, { message: 'Group name length must be <= 20' })
	.trim();

export const NewStudentSchema = z.object({
	id: z.number().optional(),
	groupid: z.number(),
	regis_num: z
		.string({ required_error: 'Registration number required' })
		.min(5, { message: 'Registration number length must be >= 5' })
		.max(20, { message: 'Registration number must be <= 20' })
		.trim(),
	firstname: z
		.string({ required_error: 'Firstname required' })
		.min(5, { message: 'Firstname length must be >= 5' })
		.max(40, { message: 'Firstname length must be <= 40' })
		.trim(),
	lastname: z
		.string({ required_error: 'Lastname required' })
		.min(5, { message: 'Lastname length must be >= 5' })
		.max(40, { message: 'Lastname length must be <= 40' })
		.trim()
});
