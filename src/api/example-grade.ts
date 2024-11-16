import { gradeSentence } from './grader.js';

async function runExampleGrades() {
    // Example sentences and their keywords
    const examples = [
        {
            sentence: "La cucaracha es muy triste hoy.",
            keywords: new Set(["cucaracha", "triste"])
        },
        {
            sentence: "El gato negro corre rápido.",
            keywords: new Set(["gato", "negro", "corre"])
        },
        {
            sentence: "Mi amigo está feliz.",
            keywords: new Set(["amigo", "feliz"])
        }
    ];

    // Grade each example
    for (const example of examples) {
        console.log("\n--- Grading Example ---");
        const score = await gradeSentence(example.sentence, example.keywords);
        console.log(`Final Score: ${score}\n`);
    }
}

// Run the examples
runExampleGrades().catch(error => {
    console.error("Error running examples:", error);
});
