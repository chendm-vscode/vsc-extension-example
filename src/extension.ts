// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import axios from 'axios';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

class Node extends vscode.TreeItem {

}

function getBaiDuHotSearch() {
	return axios({
		url: 'https://top.baidu.com/board?tab=realtime',
		headers: {
			Host: 'top.baidu.com',
			Referer: 'https://top.baidu.com/board?platform=pc&sa=pcindex_a_right',
		}
	})
}

class TreeDataProvider implements vscode.TreeDataProvider<Node> {
	onDidChangeTreeData?: vscode.Event<void | Node | Node[] | null | undefined> | undefined;
	getTreeItem(element: Node): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element
	}
	async getChildren(element?: Node | undefined): Promise<Node[]> {
		if (element) {
			return [
				{
					label: '只是测试树节点^_^'
				}
			]
		}
		const res = await getBaiDuHotSearch()
		const reg = /<!--s-data:(.*?)-->/
		const content: string = res.data
		const match = content.match(reg)
		let arr: Node[] = []
		try {
			if (match && match[1]) {
				const json = JSON.parse(match[1])
				arr = json.cards[0].content.map((v: any) => {
					return {
						label: v.query,
						tooltip: v.desc,
						command: {
							title: v.label,
							command: 'hot-search.hot-click',
							arguments: [v]
						},
						collapsibleState: vscode.TreeItemCollapsibleState.Collapsed
					} as Node
				})
			}
		} catch (e) {
			console.error(e)
		}
		return arr;
	}
	getParent?(element: Node): vscode.ProviderResult<Node> {
		throw new Error('Method not implemented.');
	}
	resolveTreeItem?(item: vscode.TreeItem, element: Node, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
		throw new Error('Method not implemented.');
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "hot-search" is now active!');

	const TREEVIEW_ID = 'baidu'

	context.subscriptions.push(
		vscode.window.createTreeView(TREEVIEW_ID, {
			treeDataProvider: new TreeDataProvider(),
			showCollapseAll: true
		}),
		vscode.commands.registerCommand('hot-search.hot-click', (arg) => {
			vscode.window.showInformationMessage(JSON.stringify(arg))
		}),
		vscode.commands.registerCommand('hot-search.show-title', () => {
			vscode.window.showInformationMessage('show-title call!')
		})
	)
}

// this method is called when your extension is deactivated
export function deactivate() { }
