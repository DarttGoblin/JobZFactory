require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function matchCVtoOffer(cvContent, offerContent) {
    // hada aykun huwa lprompt li ayt senda, expecting lpourcentage only!
    // const prompt = `
    //     You are a job matching assistant.
    //     Evaluate the following CV content and job offer content.
    //     Return ONLY the matching percentage as a number between 0 and 100, nothing else.

    //     CV:
    //     ${cvContent}

    //     JOB OFFER:
    //     ${offerContent}

    //     How well does this CV match the job offer? 
    //     Respond only with a number from 0 to 100.
    // `;

    // update bach tkun response kat returni more info
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
        const output = response.text().trim();
        console.log("Matching Percentage:", output);
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example lowl: lmatching tal3, cd data scentist / offer data scientist 
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
We are hiring a Data Scientist with at least 5 years of experience in Python, machine learning, and NLP.
Knowledge of TensorFlow, Docker, and Kubernetes is highly preferred.
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
Looking for a Backend Developer experienced in Java, Spring Boot, and SQL databases.
The ideal candidate should have experience in API development and cloud deployments.
`;

// matchCVtoOffer(cv1, offer1);
matchCVtoOffer(cv2, offer2);