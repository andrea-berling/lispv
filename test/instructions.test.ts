import { bin } from "../src/riscv";

describe('cpu simulator', () => {
	test('binary number', () => {
		expect(bin(0b11) == "11");
	});
});