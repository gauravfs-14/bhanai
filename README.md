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
  - [1. Variable and Constant Declaration](#1-variable-and-constant-declaration)
  - [2. Arithmetic Operations](#2-arithmetic-operations)
  - [3. Logical Operations](#3-logical-operations)
  - [4. String Functions](#4-string-functions)
  - [5. Console Output](#5-console-output)
  - [6. User Input](#6-user-input)
  - [7. Conditional Statements](#7-conditional-statements)
  - [8. Comments](#8-comments)
  - [9. Lists and Arrays](#9-lists-and-arrays)
  - [10. Objects](#10-objects)
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

Once installed, you can run Bhanai programs using the `chalau` command:

1. Create a `.bhn` file with your Bhanai code. For example, `example.bhn`.
2. Run the program with:
   ```bash
   chalau example.bhn
   ```

---

## Features

### 1. **Variable and Constant Declaration**

| Function      | Description         | Syntax Example               |
| ------------- | ------------------- | ---------------------------- |
| `rakha`       | Declare a variable. | `rakha("name", "Bhanai")`    |
| `sadai_rakha` | Declare a constant. | `sadai_rakha("PI", 3.14159)` |

---

### 2. **Arithmetic Operations**

| Function | Description                      | Syntax Example                       |
| -------- | -------------------------------- | ------------------------------------ |
| `jod`    | Adds two numbers.                | `rakha("sum", jod(10, 20))`          |
| `ghata`  | Subtracts two numbers.           | `rakha("difference", ghata(50, 30))` |
| `guna`   | Multiplies two numbers.          | `rakha("product", guna(5, 6))`       |
| `bhaag`  | Divides two numbers.             | `rakha("quotient", bhaag(20, 4))`    |
| `shesh`  | Finds the remainder of division. | `rakha("remainder", shesh(25, 4))`   |

---

### 3. **Logical Operations**

| Function | Description  | Syntax Example                   |
| -------- | ------------ | -------------------------------- |
| `ra`     | Logical AND. | `yadi age > 18 ra age < 60:`     |
| `athawa` | Logical OR.  | `yadi age < 18 athawa age > 60:` |
| `hoina`  | Logical NOT. | `yadi hoina(sachho):`            |

---

### 4. **String Functions**

| Function      | Description                     | Syntax Example                                     |
| ------------- | ------------------------------- | -------------------------------------------------- |
| `jodString`   | Concatenates two strings.       | `rakha("greeting", jodString("Namaste", "!"))`     |
| `lambai`      | Returns the length of a string. | `rakha("length", lambai("Namaste"))`               |
| `tola`        | Extracts a substring.           | `rakha("sub", tola("Namaste", 0, 7))`              |
| `badal`       | Replaces a substring.           | `rakha("newString", badal("Namaste", "Na", "Ka"))` |
| `thuloAkshar` | Converts string to uppercase.   | `rakha("upper", thuloAkshar("namaste"))`           |
| `sanoAkshar`  | Converts string to lowercase.   | `rakha("lower", sanoAkshar("NAMASTE"))`            |
| `chhaina`     | Checks if substring exists.     | `yadi chhaina("Namaste", "aste"):`                 |
| `kattnu`      | Splits string into an array.    | `rakha("words", kattnu("Namaste Bhanai", " "))`    |
| `khaliHatau`  | Trims whitespace.               | `rakha("trimmed", khaliHatau("   Namaste   "))`    |
| `khojnu`      | Finds position of substring.    | `rakha("pos", khojnu("Namaste", "aste"))`          |
| `ulto`        | Reverses a string.              | `rakha("reverse", ulto("Namaste"))`                |
| `thapString`  | Pads string on the right.       | `rakha("padded", thapString("Namaste", "!", 10))`  |
| `suruThap`    | Pads string on the left.        | `rakha("padded", suruThap("Namaste", "*", 10))`    |
| `sabdaGanna`  | Counts words in a string.       | `rakha("count", sabdaGanna("Namaste Bhanai"))`     |

---

### 5. **Console Output**

| Function | Description             | Syntax Example            |
| -------- | ----------------------- | ------------------------- |
| `bhanai` | Outputs to the console. | `bhanai("Hello, World!")` |

---

### 6. **User Input**

| Function     | Description                        | Syntax Example                                   |
| ------------ | ---------------------------------- | ------------------------------------------------ |
| `sodhString` | Reads string input from the user.  | `rakha("name", sodhString("Enter your name: "))` |
| `sodhNumber` | Reads numeric input from the user. | `rakha("age", sodhNumber("Enter your age: "))`   |

---

### 7. **Conditional Statements**

| Structure                 | Description           | Syntax Example                                 |
| ------------------------- | --------------------- | ---------------------------------------------- |
| `yadi ... aru`            | If-Else structure.    | `yadi age < 18: ... aru:`                      |
| `yadi ... athawa ... aru` | If-Else-If structure. | `yadi age < 13: ... athawa age < 20: ... aru:` |

---

### 8. **Comments**

| Type        | Description      | Syntax Example                         |
| ----------- | ---------------- | -------------------------------------- |
| Single-line | Inline comments. | `# This is a comment`                  |
| Multi-line  | Block comments.  | `""" This is a multi-line comment """` |

---

### 9. **Lists and Arrays**

| Function     | Description                   | Syntax Example                          |
| ------------ | ----------------------------- | --------------------------------------- |
| `lambaiList` | Gets length of array          | `bhanai(lambaiList(numbers))`           |
| `thapList`   | Adds item to end of array     | `thapList(numbers, 6)`                  |
| `hatauList`  | Removes and returns last item | `rakha("lastItem", hatauList(numbers))` |
| Array Access | Access array element by index | `numbers[0]`                            |

### 10. **Objects**

| Function        | Description                 | Syntax Example               |
| --------------- | --------------------------- | ---------------------------- |
| `chaabiList`    | Gets object keys as array   | `bhanai(chaabiList(person))` |
| `maanList`      | Gets object values as array | `bhanai(maanList(person))`   |
| Property Access | Access object property      | `person.name`                |
| Nested Access   | Access nested properties    | `school.students[0].name`    |

---

## Example Program

Here’s a complete example showcasing the features of Bhanai:

```bhn
tippani This is a sample code for the Bhanai Programming Language

rakha("name", "Bhanai User")
sadai_rakha("PI", 3.14159)

rakha("sum", jod(10, 20))
bhanai("Hello, " + name + "! Sum of 10 and 20 is: " + sum)

# String manipulation
rakha("greeting", "Namaste")
rakha("fullGreeting", jodString(greeting, " Swagat chha Bhanai ma!"))
bhanai("Full Greeting: " + fullGreeting)

yadi age < 18:
    bhanai("Timro umar kam chha.")
athawa age == 18:
    bhanai("Timro umar 18 chha.")
aru:
    bhanai("Timro umar thik chha.")
```

---

## File Extension

Save your Bhanai programs with the `.bhn` file extension. For example:

```
example.bhn
```

---

## Running Bhanai Programs

To execute `.bhn` files:

1. Ensure Node.js is installed.
2. Run the program using the Bhanai interpreter:
   ```bash
   chalau example.bhn
   ```
