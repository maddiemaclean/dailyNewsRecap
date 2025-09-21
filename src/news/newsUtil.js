require('dotenv').config();
const axios = require('axios');
const apiKey = process.env.NEWS_API_KEY; 


function getHeadlines(category) {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
    if (!apiKey) {
        console.error('api key is undefined');
        process.exit(1);
    }
    
    const url = 'https://gnews.io/api/v4/top-headlines';
    const params = {
        topic: category.topic,
        from: startDate.toISOString(),
        to: endDate.toISOString(),
        lang: 'en',
        token: apiKey 
    };
    console.log(params)
    
    return axios.get(url, { params })
        .then(response => {
            const articles = response.data.articles || [];
            return articles.slice(0, 3).map(article => ({
                title: article.title,
                link: article.url,
                name: article.source.name,
                description: article.description,
            }));
        })
        .catch(error => {
            console.error(`Error: ${error.response?.status} - ${error.response?.statusText}`);
            return null;
        });
}

function getCategoryId(Category) {
    const categories = {
        world: 1,
        business: 2,
        technology: 3,
        entertainment: 4,
        sports: 5,
        science: 6,
        health: 7
    };
    return categories[Category.toLowerCase()] || "Category not found";
}


function prepareArticles(categoryIn, jsonArray) {
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const category = getCategoryId(categoryIn);
    return jsonArray.map(article => [
        category,
        currentDate,              
        article.title || null,    
        article.link || null,      
        article.name || null,      
        article.description || null 
    ]);
}
