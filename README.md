# Function Sorter

A Visual Studio Code extension that sorts functions alphabetically in your code files.

## Features

- **Multi-language support**: PHP, Java, C#, JavaScript, TypeScript
- **Smart function detection**: Recognizes various function declaration formats
- **Preserves formatting**: Maintains original indentation and code structure
- **Easy to use**: Right-click context menu or command palette access

![Function Sorter Demo](https://raw.githubusercontent.com/yourusername/function-sorter/main/images/demo.gif)

## Supported Languages

### PHP
```php
function myFunction() {}
public function publicMethod() {}
private static function staticMethod() {}
```

### Java
```java
public void method() {}
private static int calculate() {}
protected abstract String getName();
```

### C#
```csharp
public void Method() {}
private static int Calculate() {}
protected abstract string GetName();
```

### JavaScript/TypeScript
```javascript
function myFunction() {}
const arrow = () => {}
async function asyncFunc() {}
```

## Usage

### Method 1: Context Menu
1. Open a supported file (.php, .java, .cs, .js, .ts)
2. Right-click in the editor
3. Select "Sort Functions Alphabetically"

### Method 2: Command Palette
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Sort Functions"
3. Select "Sort Functions Alphabetically"

## Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Function Sorter"
4. Click Install

## Requirements

- Visual Studio Code 1.74.0 or higher

## Known Issues

- Complex nested functions may not be sorted correctly
- Functions with unusual formatting might not be detected

## Release Notes

### 1.0.0

Initial release of Function Sorter

- Basic function sorting for PHP, Java, C#, JavaScript, TypeScript
- Context menu integration
- Command palette support

## Contributing

Found a bug or want to contribute? Please visit our [GitHub repository](https://github.com/yourusername/function-sorter).

## License

This extension is licensed under the [MIT License](LICENSE).

---

**Enjoy sorting your functions! 🚀**