# Bhanai Programming Language

![npm version](https://img.shields.io/npm/v/bhanai)
![npm downloads](https://img.shields.io/npm/dm/bhanai)
![license](https://img.shields.io/npm/l/bhanai)
![GitHub stars](https://img.shields.io/github/stars/gauravfs-14/bhanai)
![GitHub issues](https://img.shields.io/github/issues/gauravfs-14/bhanai)

**Bhanai** is a simple and intuitive programming language with a Nepali touch. It leverages Node.js under the hood for execution, allowing users to create `.bhn` files and run them seamlessly.

---

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [1. Variable Declaration](#1-variable-declaration)
  - [2. Constant Declaration](#2-constant-declaration)
  - [3. Arithmetic Operations](#3-arithmetic-operations)
  - [4. String Concatenation](#4-string-concatenation)
  - [5. Console Output](#5-console-output)
  - [6. Nested Function Calls](#6-nested-function-calls)
  - [7. Comments](#7-comments)
  - [8. User Input](#8-user-input)
  - [9. Conditional Statements](#9-conditional-statements)
  - [10. Logical Operators](#10-logical-operators)
  - [11. Boolean Values](#11-boolean-values)
- [Example Program](#example-program)
- [File Extension](#file-extension)
- [Running Bhanai Programs](#running-bhanai-programs)

---

## Installation

To install Bhanai globally via NPM, use the following command:

```bash
npm install -g bhanai
```

---

## Usage

Once installed, you can run Bhanai programs using the `bhanai` command:

1. Create a `.bhn` file with your Bhanai code. For example, `example.bhn`.
2. Run the program with:
   ```bash
   bhanai example.bhn
   ```

---

## Features

### 1. **Variable Declaration**

Declare variables using the `rakha` keyword. Variables can store strings, numbers, or the results of operations.

```bhn
rakha("name", "Bhanai")
rakha("sum", jod(10, 20))
```

---

### 2. **Constant Declaration**

Declare constants using `sadai_rakha`. Constants are immutable and cannot be reassigned.

```bhn
sadai_rakha("PI", 3.14159)
```

---

### 3. **Arithmetic Operations**

Perform basic arithmetic operations using built-in functions:

#### Addition

```bhn
rakha("sum", jod(10, 20))   tippani Sum of 10 and 20
```

#### Subtraction

```bhn
rakha("difference", ghata(50, 30))   tippani Difference between 50 and 30
```

#### Multiplication

```bhn
rakha("product", guna(5, 6))   tippani Product of 5 and 6
```

#### Division

```bhn
rakha("quotient", bhaag(20, 4))   tippani Quotient of 20 divided by 4
```

#### Modulus

```bhn
rakha("remainder", shesh(25, 4))   tippani Remainder when 25 is divided by 4
```

---

### 4. **String Concatenation**

Easily combine strings and variables using `+`.

```bhn
rakha("name", "Bhanai")
bhanai("Hello, " + name + "!")
```

---

### 5. **Console Output**

Print messages and values to the console using `bhanai`.

```bhn
bhanai("Namaste, Duniya!")
bhanai("Sum of 10 and 20 is: " + sum)
```

---

### 6. **Nested Function Calls**

Combine multiple operations using nested function calls.

```bhn
rakha("nestedResult", jod(5, guna(2, 3)))   tippani Adds 5 to the product of 2 and 3
bhanai("Nested function call result: " + nestedResult)
```

---

### 7. **Comments**

Bhanai supports both single-line and multi-line comments:

#### Single-line Comments

```bhn
# This is a single-line comment
```

#### Multi-line Comments

```bhn
"""
This is
a multi-line
comment
"""
```

---

### 8. **User Input**

Use `sodhString` to take string input and `sodhNumber` for numeric input.

#### String Input

```bhn
rakha("name", sodhString("What is your name? "))
bhanai("Namaste, " + name + "! Welcome to Bhanai.")
```

#### Number Input

```bhn
rakha("num1", sodhNumber("Enter the first number: "))
rakha("num2", sodhNumber("Enter the second number: "))
rakha("sum", jod(num1, num2))
bhanai("The sum of " + num1 + " and " + num2 + " is: " + sum)
```

---

### 9. **Conditional Statements**

Control program flow with `yadi` (if), `athawa` (else if), and `aru` (else).

#### If-Else Example

```bhn
rakha("age", 15)

yadi age < 18:
    bhanai("Timro umar kam chha.")
aru:
    bhanai("Timro umar thik chha.")
```

#### If-Else-If Example

```bhn
rakha("age", 15)

yadi age < 13:
    bhanai("Timro umar balak ho.")
athawa age < 20:
    bhanai("Timro umar kishor ho.")
aru:
    bhanai("Timro umar pragatisheel ho.")
```

---

### 10. **Logical Operators**

Use `ra` (AND), `athawa` (OR), and `hoina` (NOT) for logical conditions.

#### Logical AND Example

```bhn
yadi age > 18 ra age < 60:
    bhanai("Timro umar kaam garna anukul chha.")
```

#### Logical OR Example

```bhn
yadi age < 18 athawa age > 60:
    bhanai("Timro umar kaam garna anukul chhaina.")
```

#### Logical NOT Example

```bhn
yadi hoina(sachho):
    bhanai("This is not true.")
```

---

### 11. **Boolean Values**

Bhanai includes boolean values: `sachho` (true) and `jutho` (false).

```bhn
rakha("truth", sachho)
rakha("falsehood", jutho)

yadi truth:
    bhanai("Sachho is true!")
```

---

### Example Program

Here’s a complete example showcasing the features of Bhanai:

```bhn
tippani This is a sample code for the Bhanai Programming Language

rakha("name", "Bhanai User")
sadai_rakha("PI", 3.14159)

rakha("sum", jod(10, 20))
bhanai("Hello, " + name + "! Sum of 10 and 20 is: " + sum)

"""
This is a multi-line comment
explaining the next code block
"""
rakha("difference", ghata(50, 30))
bhanai("Difference between 50 and 30 is: " + difference)

rakha("nestedResult", jod(5, guna(2, 3)))
bhanai("Nested function call result: " + nestedResult)

yadi age < 18:
    bhanai("Timro umar kam chha.")
athawa age == 18:
    bhanai("Timro umar 18 chha.")
aru:
    bhanai("Timro umar thik chha.")
```

---

### File Extension

Save your Bhanai programs with the `.bhn` file extension. For example:

```
example.bhn
```

---

### Running Bhanai Programs

To execute `.bhn` files:

1. Ensure Node.js is installed.
2. Run the program using the Bhanai interpreter:
   ```bash
   chalau example.bhn
   ```
