const pythonQuizData = [
    {
        question: "Which data type is immutable in Python?",
        options: ["list", "dict", "tuple", "set"],
        answer: "tuple",
        explanation: "Tuples are immutable; once created, their elements cannot be changed. Lists, dictionaries, and sets are mutable."
    },
    {
        question: `What is the output of the following code?
            <pre class="python-code"><code>
x = [10, 20, 30]
x.append(40)
print(x[-2])
            </code></pre>`,
        options: ["10", "20", "30", "40"],
        answer: "30",
        explanation: "The list becomes [10, 20, 30, 40]. The index -2 accesses the second-to-last element, which is 30."
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