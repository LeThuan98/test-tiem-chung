export enum ResultEnum {
    A 	= "A",
    B 	= "B",
    C 	= "C",
	D 	= "D",
};

export function ResultTrans(status = "A"): string {
	return {
		"A": 'A',
		"B": 'B',
		"C": 'C',
		"D": 'D',
	}[status] || '';
}
