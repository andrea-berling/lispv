class Cane {
	static casa = "123";

	get casa() {
		return (this.constructor as typeof Cane).casa!;
	}
}


console.log(Cane.casa);
let c = new Cane();
console.log(c.casa)
