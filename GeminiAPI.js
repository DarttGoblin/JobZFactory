require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function matchCVtoOffer(cvContent, offerContent, threshold = 50) {
    const prompt = `
        You are an intelligent job matching assistant.

        Your task is to evaluate how well a candidate's CV matches a job offer. 
        Return a JSON object with ONLY the following fields, each with a number between 0 and 100:
        - experience_match
        - projects_match
        - skills_match

        Do not include any explanation, comments, or additional text. Return ONLY the JSON object.

        CV:
        ${cvContent}

        JOB OFFER:
        ${offerContent}

        Evaluate and return the result.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let output = response.text().trim();

        // Remove markdown-style code block if present
        if (output.startsWith("```")) {
            output = output.replace(/```(json)?\s*/i, '').replace(/```$/, '').trim();
        }

        const scores = JSON.parse(output);
        const average =
            (scores.experience_match + scores.projects_match + scores.skills_match) / 3;

        const decision = average >= threshold ? 'ACCEPTED' : 'REJECTED';

        console.log("Evaluation:", scores);
        console.log("Average Score:", average.toFixed(2));
        console.log("Decision:", decision);
    } catch (error) {
        console.error("Error:", error);
    }
}

const cv1 = `
{
  "identite": {
    "nom": "Youssef Handaoui",
    "email": "ucef.handaoui@gmail.com",
    "telephone": "+212 65014501",
    "adresse": "20222 CASABLANCA",
    "linkedin": "youssef-handaoui-84b526228"
  },
  "profil": "Étudiant en quatrième année cycle d'ingénieur informatique et réseaux",
  "qualites": [
    "Adaptabilité",
    "Gestion du temps",
    "Esprit d'équipe"
  ],
  "langues": [
    "Anglais",
    "Français",
    "Arabe"
  ],
  "centres_interet": [
    "Natation",
    "Sport collectif",
    "Fitness"
  ],
  "formation": [
    {
      "titre": "Gestionnaire de stock"
    }
  ],
  "experience": [
    {
      "poste": "Stagiaire Développeur",
      "entreprise": "Tech Solutions",
      "duree": "Juillet 2023 - Août 2023",
      "description": "Développement d'une application de gestion de stock en utilisant Python et MySQL."
    }
  ]
}
`;
const offer1 = `
  Looking for a Backend Developer experienced in Java, Spring Boot, and SQL databases.
  The ideal candidate should have experience in API development and cloud deployments.
`;

const cv2 = `
{
  "identite": {
    "nom": "Yassine Bazgour",
    "email": "yassine.bazgour@gmail.com",
    "telephone": "+212 638659880",
    "adresse": "",
    "linkedin": "Yassine Bazgour",
    "github": "DarttGoblin",
    "portfolio": "yassinebazgour.vercel.app"
  },
  "profil": "Passionate AI master’s student based in Marrakech, Morocco, with a strong foundation in problem-solving and practical experience in machine learning, robotics, and full-stack development.",
  "qualites": [],
  "langues": ["Arabic: Native", "English: Fluent", "French: Good", "Spanish: Elementary"],
  "competences": {
    "programmation": ["TensorFlow", "PyTorch", "Scikit-learn", "JavaScript", "C++", "Python", "Arduino IDE", "React", "Node.js"],
    "web": ["HTML", "CSS", "React"],
    "base_de_donnees": ["SQL", "MongoDB"],
    "systèmes": ["Raspberry Pi", "Arduino IDE", "Node-RED"],
    "modelisation": [],
    "autres": []
  },
  "certifications": [],
  "formations": [
    {
      "titre": "Master in Artificial Intelligence",
      "date_debut": "",
      "date_fin": "Expected 2026",
      "lieu": "Faculty of Science Semlalia | Marrakesh"
    },
    {
      "titre": "Bachelor’s Degree in Fundamental Studies in Mathematics and Computer Science",
      "date_debut": "",
      "date_fin": "2024",
      "lieu": "Faculty of Science Semlalia | Marrakesh"
    }
  ],
  "experiences": [],
  "projets": [
    {
      "titre": "Freelance Developer",
      "date_debut": "2024 – 2025",
      "description": "Heatz: An e-commerce site built with React, Node.js, and MongoDB, offering tech products and accessories through a modern, scalable web platform. https://heatz.ma/"
    }
  ],
  "centres_interet": []
}
`;

const offer2 = `
We are hiring a Data Scientist with at least 5 years of experience in Python, machine learning, and NLP.
Knowledge of TensorFlow, Docker, and Kubernetes is highly preferred.
`;

const cv3 = `
  {
  "identite": {
    "nom": "Sara El Amrani",
    "email": "sara.amrani@gmail.com",
    "telephone": "+212 654321987",
    "adresse": "Marrakech, Morocco",
    "linkedin": "saraelamrani",
    "github": "sara-ai",
    "portfolio": "saraelamrani.dev"
  },
  "profil": "Master's student in Artificial Intelligence with hands-on experience in machine learning, deep learning, and web development. Passionate about solving real-world problems with data-driven solutions.",
  "langues": ["Arabic: Native", "English: Fluent", "French: Good"],
  "competences": {
    "programmation": ["Python", "TensorFlow", "Scikit-learn", "PyTorch", "JavaScript", "Node.js"],
    "web": ["HTML", "CSS", "React"],
    "base_de_donnees": ["SQL", "MongoDB"],
    "systèmes": ["Raspberry Pi", "Arduino"],
    "modelisation": ["UML", "ERD"],
    "autres": ["Docker", "Git"]
  },
  "formations": [
    {
      "titre": "Master in Artificial Intelligence",
      "date_debut": "2024",
      "date_fin": "2026",
      "lieu": "Faculty of Science Semlalia | Marrakesh"
    },
    {
      "titre": "Bachelor in Computer Science",
      "date_debut": "2021",
      "date_fin": "2024",
      "lieu": "Faculty of Science Semlalia | Marrakesh"
    }
  ],
  "experiences": [
    {
      "poste": "AI Intern",
      "entreprise": "AI Lab Morocco",
      "duree": "March 2024 - June 2024",
      "description": "Worked on image classification and NLP projects using TensorFlow and Hugging Face Transformers."
    }
  ],
  "projets": [
    {
      "titre": "Smart Health Assistant",
      "date_debut": "2024",
      "description": "Built a medical chatbot powered by GPT and integrated with a React frontend and Flask backend."
    }
  ],
  "centres_interet": ["AI Ethics", "Open Source", "UI/UX Design"]
}
`

const offer3 = `
We are seeking a Junior Machine Learning Engineer with strong foundations in Python and hands-on experience with deep learning frameworks like TensorFlow or PyTorch.

Requirements:
- Knowledge of Scikit-learn, Transformers (Hugging Face), and data preprocessing techniques.
- Familiarity with REST APIs and web frameworks.
- Experience with version control (Git) and deployment tools (Docker).
- Strong interest in AI-driven healthcare or NLP applications is a plus.

Location: Remote/Morocco preferred

`

// matchCVtoOffer(cv1, offer1);
// matchCVtoOffer(cv2, offer2);
matchCVtoOffer(cv3, offer3);