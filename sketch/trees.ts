class TreeNode {
	value: string;
	children: TreeNode[] = [];
	constructor(v: string) {
		this.value = v;
	}
}

function dfs(n: TreeNode) {
	console.log(n.value);
	for (let child of n.children) dfs(child);
}

function bfs(n: TreeNode) {
	let children: TreeNode[] = [n];
	while (true) {
		if (children.length == 0) break;

		let newChildren: TreeNode[] = [];

		for (let child of children) {
			console.log(child.value);
			for (let child_of_child of child.children)
				newChildren.push(child_of_child);
		}

		children = newChildren;
	}
}

function main() {
	//1
	//	11
	//		111
	//	12
	//		121
	//	13
	//		131
	//			1311
	//		132

	const n1 = new TreeNode("0");

	const n11 = new TreeNode("11");
	const n12 = new TreeNode("12");
	const n13 = new TreeNode("13");

	n1.children = [n11, n12, n13];

	const n111 = new TreeNode("111");

	n11.children = [n111];

	const n121 = new TreeNode("121");

	n12.children = [n121];

	const n131 = new TreeNode("131");
	const n132 = new TreeNode("132");

	n13.children = [n131, n132];

	const n1311 = new TreeNode("1311");

	n131.children = [n1311];

	dfs(n1);
	bfs(n1);
}

main();