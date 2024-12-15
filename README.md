# Bhanai Programming Language

Bhanai is a simple and intuitive programming language with a Nepali touch, designed to perform basic operations like variable declarations, arithmetic calculations, console outputs, and user inputs. It leverages Node.js under the hood for execution, allowing users to create `.bhn` files and run them seamlessly.

## Features

### 1. **Variable Declaration**

Declare variables using the `rakha` keyword. Variables can store strings, numbers, or the results of operations.

```bhn
rakha("name", "Gaurab")
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
rakha("name", "Gaurab")
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

### Example Program

Here’s a complete example showcasing the features of Bhanai:

```bhn
tippani This is a sample code for the Bhanai Programming Language

rakha("name", "Gaurab")
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

rakha("product", guna(5, 6))
bhanai("Product of 5 and 6 is: " + product)

rakha("quotient", bhaag(20, 4))
bhanai("Quotient of 20 and 4 is: " + quotient)

rakha("remainder", shesh(25, 4))
bhanai("Remainder when 25 is divided by 4 is: " + remainder)

rakha("name", sodhString("What is your name? "))
bhanai("Namaste, " + name + "! Welcome to Bhanai.")

rakha("num1", sodhNumber("Enter the first number: "))
rakha("num2", sodhNumber("Enter the second number: "))
rakha("sum", jod(num1, num2))
bhanai("The sum of " + num1 + " and " + num2 + " is: " + sum)
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
