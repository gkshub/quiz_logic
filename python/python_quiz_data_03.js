const pythonQuizData_03 = [
    {
        question: "What is the output of the following Python code?",
        options: ["<class 'float'>", "<class 'str'>", "<class 'int'>", "Syntax Error"],
        answer: "<class 'float'>",
        explanation: "The standard division operator (/) in Python 3 always returns a floating-point number, regardless of whether the mathematical result is an integer."
    },
    {
        question: "What is the result of the expression 5 // 2 + 5 % 2?",
        options: ["3.5", "3", "4", "2.5"],
        answer: "3",
        explanation: "The floor division (//) of $5 // 2$ is $2$, and the modulo operator (%) of $5 % 2$ is $1$. The sum $2 + 1$ equals $3$."
    },
    {
        question: `Which Python statement will correctly open a file named 'data.txt' for reading?`,
        options: [
            `<pre><code>file('data.txt', 'r')</code></pre>`,
            `<pre><code>open('data.txt')</code></pre>`,
            `<pre><code>open('data.txt', mode='read')</code></pre>`,
            `<pre><code>read_file('data.txt')</code></pre>`
        ],
        answer: `<pre><code>open('data.txt')</code></pre>`,
        explanation: "The default mode for Python's `open()` function is 'r' (read), so providing only the file name is sufficient and correct."
    }
    // ADD MORE QUESTIONS HERE
];