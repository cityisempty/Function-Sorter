# Change Log

All notable changes to the "function-sorter" extension will be documented in this file.

## [1.0.0] - 2025-06-06

### Added
- Initial release of Function Sorter extension
- Support for sorting functions in PHP files
- Support for sorting functions in Java files  
- Support for sorting functions in C# files
- Support for sorting functions in JavaScript files
- Support for sorting functions in TypeScript files
- Right-click context menu integration
- Command palette integration
- Alphabetical sorting of function names
- Preservation of original code formatting and indentation
- Smart function detection for various declaration formats

### Features
- Multi-language function detection with language-specific regex patterns
- Automatic brace counting to determine function boundaries
- Safe text replacement that maintains non-function code
- User-friendly error messages and success notifications

### Supported Function Formats
- PHP: `function`, `public function`, `private function`, `protected function`, `static function`
- Java: Methods with various access modifiers and return types
- C#: Methods with various access modifiers and return types  
- JavaScript: `function`, arrow functions, async functions
- TypeScript: Same as JavaScript plus type annotations