require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function matchCVtoOffer(cvContent, offerContent) {
    // hada aykun huwa lprompt li ayt senda, expecting lpourcentage only!
    const prompt = `
        You are a job matching assistant.
        Evaluate the following CV content and job offer content.
        Return ONLY the matching percentage as a number between 0 and 100, nothing else.

        CV:
        ${cvContent}

        JOB OFFER:
        ${offerContent}

        How well does this CV match the job offer? Provide only the percentage number.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const output = response.text().trim();
        console.log("Matching Percentage:", output);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example lowl: lmatching tal3, cd data scentist / offer data scientist 
const cv1 = `
Jane Smith
Senior Data Scientist with 6 years of experience in machine learning, Python, TensorFlow, and data analysis.
Expert in predictive modeling, natural language processing, and model deployment using Docker and Kubernetes.
`;
const offer1 = `
We are hiring a Data Scientist with at least 5 years of experience in Python, machine learning, and NLP.
Knowledge of TensorFlow, Docker, and Kubernetes is highly preferred.
`;

// Example tani: matching habt, cv designer / offer backend
const cv2 = `
Alex Johnson
Graphic Designer with 4 years of experience in Adobe Illustrator, Photoshop, and UI/UX design.
Worked on branding, digital illustration, and responsive design projects.
`;
const offer2 = `
Looking for a Backend Developer experienced in Java, Spring Boot, and SQL databases.
The ideal candidate should have experience in API development and cloud deployments.
`;

matchCVtoOffer(cv1, offer1);
matchCVtoOffer(cv2, offer2);