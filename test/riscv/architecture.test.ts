import { Registers } from "../../src/riscv/register";
import { Memory, MemoryMode } from "../../src/riscv/memory";

describe('architecture', () => {
	test('register i0 hardwired to 0', () => {
		let r = Registers.get(0);
		try {
			r.value = 10;
			// impossible
			expect(true).toBe(false);
		} catch (e) {
		}
		expect(r.value).toBe(0);
	});

	test("big endian memory alignments", () => {
		Memory.clean();
		Memory.mode = MemoryMode.BIG_ENDIAN

		let n = 0x12abcdef;
		Memory.set(0x0, n);
		Memory.set(0x4, n);

		// 12 ab cd ef

		expect(Memory.get(0x0, 1)).toBe(0x12 | 0);
		expect(Memory.get(0x0, 2)).toBe(0x12ab | 0);
		expect(Memory.get(0x0, 4)).toBe(0x12abcdef | 0);

		// ab cd ef 12

		expect(Memory.get(0x1, 1)).toBe(0xab | 0);
		expect(Memory.get(0x1, 2)).toBe(0xabcd | 0);
		expect(Memory.get(0x1, 4)).toBe(0xabcdef12 | 0);

		// cd ef 12 ab

		expect(Memory.get(0x2, 1)).toBe(0xcd | 0);
		expect(Memory.get(0x2, 2)).toBe(0xcdef | 0);
		expect(Memory.get(0x2, 4)).toBe(0xcdef12ab | 0);

		// ef 12 ab cd

		expect(Memory.get(0x3, 1)).toBe(0xef | 0);
		expect(Memory.get(0x3, 2)).toBe(0xef12 | 0);
		expect(Memory.get(0x3, 4)).toBe(0xef12abcd | 0);

		Memory.set(0x1, 0x67, 1);

		// 67 cd ef 12

		expect(Memory.get(0x1, 1)).toBe(0x67 | 0);
		expect(Memory.get(0x1, 2)).toBe(0x67cd | 0);
		expect(Memory.get(0x1, 4)).toBe(0x67cdef12 | 0);

	})

	test("little endian memory alignments", () => {
		Memory.clean();
		Memory.mode = MemoryMode.BIG_ENDIAN

		let n = 0x12abcdef;
		Memory.set(0x0, n);
		Memory.set(0x4, n);

		// ef cd ab 12

		// expect(Memory.get(0x0, 1)).toBe(0x12 | 0);
		// expect(Memory.get(0x0, 2)).toBe(0x12ab | 0);
		// expect(Memory.get(0x0, 4)).toBe(0x12abcdef | 0);

		// cd ab 12 ef

		// expect(Memory.get(0x1, 1)).toBe(0xab | 0);
		// expect(Memory.get(0x1, 2)).toBe(0xabcd | 0);
		// expect(Memory.get(0x1, 4)).toBe(0xabcdef12 | 0);

		// ab 12 ef cd

		// expect(Memory.get(0x2, 1)).toBe(0xcd | 0);
		// expect(Memory.get(0x2, 2)).toBe(0xcdef | 0);
		// expect(Memory.get(0x2, 4)).toBe(0xcdef12ab | 0);

		// ab 12 ef cd

		// expect(Memory.get(0x3, 1)).toBe(0xef | 0);
		// expect(Memory.get(0x3, 2)).toBe(0xef12 | 0);
		// expect(Memory.get(0x3, 4)).toBe(0xef12abcd | 0);

		// Memory.set(0x1, 0x67, 1);

		// ef 67 ab 12

		// expect(Memory.get(0x0, 1)).toBe(0x12 | 0);
		// expect(Memory.get(0x0, 2)).toBe(0x12ab | 0);
		// expect(Memory.get(0x0, 4)).toBe(0x12abcdef | 0);

		// 67 ab 12 ef

		// expect(Memory.get(0x1, 1)).toBe(0xab | 0);
		// expect(Memory.get(0x1, 2)).toBe(0xabcd | 0);
		// expect(Memory.get(0x1, 4)).toBe(0xabcdef12 | 0);

		// 67 12 ef cd

		// expect(Memory.get(0x2, 1)).toBe(0xcd | 0);
		// expect(Memory.get(0x2, 2)).toBe(0xcdef | 0);
		// expect(Memory.get(0x2, 4)).toBe(0xcdef12ab | 0);

		// 67 12 ef cd

		// expect(Memory.get(0x3, 1)).toBe(0xef | 0);
		// expect(Memory.get(0x3, 2)).toBe(0xef12 | 0);
		// expect(Memory.get(0x3, 4)).toBe(0xef12abcd | 0);
	})
});
