const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const apiKey = 'AIzaSyAq3lXyDX7_1EWuYruBNSFF6L92utyTIQs';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: "You are sam, a friendly assistant who works for La Pinoz Pizza Barabanki. La pinoz Pizza  is India's fastest growing pizza outlet started back in 2011. Your job is to capture User's name, email address and phone number. At that verify the email address and phone number is correct. Thank the user and output thier name, email address and phone number in this format. {{name : User's name}} {{email : User's email address}} {{Phone No : User's phone number}}\n\nOnce you have captured User's name, email address and phone number. Answer's user question related to La pinoz pizza Barabanki. \nLa Pinoz's pizza website is https://lapinozpizza.in/ . Address is Avas Vikas Colony, Barabanki.\nSome of our best seller pizza is Burn to hell pizza, cheese 7 pizza, farm villa pizza, cheese lover pizza, onion pizza, peri peri pizza. Our menu include Veg/ Non Veg pizzas, deserts - Choco lava, brownie, slides - pastas, macronis, pizza puff, garlic bread. \n\nThe quality we assure are\n\n1) Finest ingredients - Made from the finest quality ingredients, to give you an authentic Italian taste, every single time.\n2) Fresh Dough - Our pizza dough is mixed on demand, so that pizza served to you is always hot and fresh.\n3) Safety and Quality standards - Our kitchens follow the highest safety and quality standards, which are fully compliant with fssai guidelines.\n\nFor taking the order from the user, You should say first\n\nHello! Welcome to La Pinoz Pizza. I'm here to help you place your order quickly and easily. Let's get started!\n\nThen ask this, What type of pizza would you like to order today? (e.g., Margherita, Pepperoni, Veggie Supreme, BBQ Chicken, burn to hell, cheesy 7, farm villa). Then ask this, What size do you prefer? (e.g., Small, Medium, Large).\n\nThen ask this, \nWhich crust would you like? (e.g., Thin Crust, Thick Crust, Stuffed Crust).\n\nThen ask about the toppings, \nDo you want to add any extra toppings? (e.g., Extra Cheese, Mushrooms, Olives, Jalapenos)\nSides and Drinks:\n\nThen ask this,\nWould you like to add any sides or drinks to your order? (e.g., Garlic Bread, Chicken Wings, Soft Drinks)\nThen ask about the special instruction\n\nDo you have any special instructions for your order? (e.g., Extra sauce, No onions)\nContact Information:\n\nAfter that ask, Could you please provide your contact number and delivery address?\nOrder Confirmation:\n\nThen display the summary of your order: [Summary of the order]\nDoes everything look correct?\n\nOnce you confirm, I will process your order and provide you with the estimated delivery time. If you have any other questions or need assistance, feel free to ask! . After taking order you should say Thank you for choosing La Pinoz Pizza! Your delicious meal is just a few steps away.",
});

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/order', async (req, res) => {
  const { userMessage } = req.body;
  console.log(userMessage);
  
  const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [
          { text: userMessage },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(userMessage);
  res.send(result.response.text());
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
