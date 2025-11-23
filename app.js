const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = 3000

function generateCombinations(word1, word2) {
    const combinations = []

    combinations.push(word1 + word2)
    combinations.push(word2 + word1)

    const mid1 = Math.floor(word1.length / 2)
    const mid2 = Math.floor(word2.length / 2)
    combinations.push(word1.slice(0, Math.ceil(word1.length / 2)) + word2.slice(mid2))
    combinations.push(word2.slice(0, Math.ceil(word2.length / 2)) + word1.slice(mid1))

    if (word1.length > 1 && word2.length > 1) {
        combinations.push(word1[0] + word2[0] + word1.slice(1) + word2.slice(1))
    }

    const unique = [...new Set(combinations)]
    return unique.slice(0, 5)
}

function generateGoodness() {
    return Math.round((Math.random() * 5) * 10) / 10
}

/* 
GET: /api/combine?name1=James&name2=Alvin 
*/
app.get("/api/combine", (req, res)=> {
    const name1 = req.query.name1 || ""
    const name2 = req.query.name2 || ""

    let result = {
        name1: name1,
        name2: name2,
        results: []
    }

    if (name1 && name2) {
        const combinations = generateCombinations(name1, name2)
        result.results = combinations.map((name, index) => ({
            id: index + 1,
            name: name,
            goodness: generateGoodness()
        }))
    }

    const filePath = path.join(__dirname, "/logs/output.log")
    fs.appendFile(filePath, `${new Date().toISOString()} | ${JSON.stringify(result)}\n`, (err)=> {
        if (err) console.log(err)
    })

    res.json(result)
})

/*
{   
    "name1":"John", 
    "name2":"Bob", 
    "results": [{"id":1, "name":"JohnBob", "goodness":4.0},
                {"id":2, "name":"Bohn",    "goodness":1.0}
                {"id":3, "name":"Johob",   "goodness":3.5}] 
}
*/





app.listen(PORT, ()=> {
    console.log(`Server started on http://localhost:${PORT}`)
})