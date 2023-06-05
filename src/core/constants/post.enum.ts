export enum StatusEnum {
    NEW 		= 1,
    IN_REVIEW 	= 2,
    PUBLISHED 	= 3,
	IN_ACTIVE 	= 4,
	IN_DRAFT 	= 5
};

export function StatusTrans(status = 1): string {
	return {
		1: 'NEW',
		2: 'IN-REVIEW',
		3: 'PUBLISHED',
		4: 'IN-ACTIVE',
		5: 'IN-DRAFT',
	}[status] || '';
}
