import * as vscode from 'vscode';

interface FunctionInfo {
  name: string;
  fullText: string;
  startLine: number;
  endLine: number;
  indent: string;
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Function Sorter is now active!');

  const disposable = vscode.commands.registerCommand('function-sorter.sortFunctions', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const document = editor.document;
    const languageId = document.languageId;
    
    // 检查是否支持的语言
    if (!['php', 'java', 'csharp', 'javascript', 'typescript'].includes(languageId)) {
      vscode.window.showWarningMessage('This language is not supported for function sorting');
      return;
    }

    try {
      await sortFunctions(editor, languageId);
      vscode.window.showInformationMessage('Functions sorted successfully!');
    } catch (error) {
      vscode.window.showErrorMessage(`Error sorting functions: ${error}`);
    }
  });

  context.subscriptions.push(disposable);
}

async function sortFunctions(editor: vscode.TextEditor, languageId: string) {
  const document = editor.document;
  const text = document.getText();
  const lines = text.split('\n');

  // 根据语言获取函数正则表达式
  const functionRegex = getFunctionRegex(languageId);
  const functions: FunctionInfo[] = [];

  // 查找所有函数
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(functionRegex);
    
    if (match) {
      const functionName = extractFunctionName(match, languageId);
      const indent = line.match(/^(\s*)/)?.[1] || '';
      
      // 找到函数的结束位置
      const endLine = findFunctionEnd(lines, i, languageId);
      
      if (endLine > i) {
        const functionLines = lines.slice(i, endLine + 1);
        const fullText = functionLines.join('\n');
        
        functions.push({
          name: functionName,
          fullText: fullText,
          startLine: i,
          endLine: endLine,
          indent: indent
        });
      }
    }
  }

  if (functions.length === 0) {
    vscode.window.showInformationMessage('No functions found to sort');
    return;
  }

  // 按函数名排序
  functions.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  // 构建新的文本
  const newText = rebuildTextWithSortedFunctions(lines, functions);

  // 应用更改
  const fullRange = new vscode.Range(
    document.positionAt(0),
    document.positionAt(text.length)
  );

  await editor.edit(editBuilder => {
    editBuilder.replace(fullRange, newText);
  });
}

function getFunctionRegex(languageId: string): RegExp {
  switch (languageId) {
    case 'php':
      return /^\s*(?:(?:public|private|protected|static|\s)+\s+)?function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
    case 'java':
      return /^\s*(?:(?:public|private|protected|static|final|abstract|\s)+\s+)*[a-zA-Z_][a-zA-Z0-9_<>,\s]*\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
    case 'csharp':
      return /^\s*(?:(?:public|private|protected|internal|static|virtual|override|abstract|\s)+\s+)*[a-zA-Z_][a-zA-Z0-9_<>,\s]*\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
    case 'javascript':
    case 'typescript':
      return /^\s*(?:(?:export|async|\s)+\s+)?(?:function\s+([a-zA-Z_][a-zA-Z0-9_]*)|([a-zA-Z_][a-zA-Z0-9_]*)\s*(?::\s*[^=]+)?\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>|\([^)]*\)\s*:\s*[^=]+\s*=>))/;
    default:
      return /^\s*(?:function\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  }
}

function extractFunctionName(match: RegExpMatchArray, languageId: string): string {
  // 对于 JavaScript/TypeScript，函数名可能在不同的捕获组中
  if (languageId === 'javascript' || languageId === 'typescript') {
    return match[1] || match[2] || 'unknown';
  }
  return match[1] || 'unknown';
}

function findFunctionEnd(lines: string[], startLine: number, languageId: string): number {
  let braceCount = 0;
  let inFunction = false;
  
  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];
    
    // 计算大括号
    for (const char of line) {
      if (char === '{') {
        braceCount++;
        inFunction = true;
      } else if (char === '}') {
        braceCount--;
        if (inFunction && braceCount === 0) {
          return i;
        }
      }
    }
    
    // 对于某些语言，如果没有大括号，查找分号结尾
    if (!inFunction && line.includes(';') && !line.includes('{')) {
      return i;
    }
  }
  
  return startLine;
}

function rebuildTextWithSortedFunctions(lines: string[], functions: FunctionInfo[]): string {
  if (functions.length === 0) {
    return lines.join('\n');
  }

  // 创建一个标记数组，标记哪些行是函数的一部分
  const functionLines = new Set<number>();
  functions.forEach(func => {
    for (let i = func.startLine; i <= func.endLine; i++) {
      functionLines.add(i);
    }
  });

  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    if (functionLines.has(i)) {
      // 如果这是第一个函数的开始，插入所有排序后的函数
      if (i === functions[0].startLine) {
        functions.forEach((func, index) => {
          if (index > 0) {
            result.push(''); // 在函数之间添加空行
          }
          result.push(func.fullText);
        });
      }
      
      // 跳过原始函数的所有行
      const currentFunc = functions.find(f => f.startLine === i);
      if (currentFunc) {
        i = currentFunc.endLine + 1;
      } else {
        // 如果不是第一个函数，跳过这些行
        i++;
      }
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  return result.join('\n');
}

export function deactivate() {}