const exp = require('constants')
const express=require('express')

const app=express()
const cors=require('cors')

const path=require('path')

const {open}=require('sqlite')
const sqlite3=require('sqlite3')

const dbPath=path.join(__dirname,"database.db")

app.use(express.json())
app.use(cors())

let db=null

const initializeDBAndPath=async ()=>{
    try {
       db= await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3010,()=>{
            console.log('server is running... at http://localhost:3010/')
        })
    } catch (error) {
        console.log(`DB ERROR : ${error.message}`)
        process.exit(1)
    } 
}

initializeDBAndPath()


app.get("/",(request,response)=>{
    response.send('your on home page... use another url....')
})


//get all movies data
app.get('/movies/',async (request,response)=>{
    const query=`select * from movies order by movie_id;`;
    const result=await db.all(query)
    response.send(result)
})

//get the specific movie data

app.get('/movies/:id/',async(request,response)=>{
    const {id}=request.params
    const query=`select * from movies where movie_id = ${id};`;
    const res=await db.get(query)
    response.send(res)
})




//delete specific movie data

app.delete('/movies/:id/',async(request,response)=>{
    const {id}=request.params
    const query=`delete from movies where movie_id = ${id};`
    const res=db.run(query)
    response.send('successfully deleted')
})

//add new movie data



app.post("/movies/",async (request,response)=>{
    const movie_details=request.body
    const {movie_id,movie_name,movie_collection_in_cr,movie_genre,movie_rating}=movie_details
    const query=`insert into movies
    (movie_id,movie_name,movie_collection_in_cr,movie_genre,movie_rating)
    values(${movie_id},'${movie_name}',${movie_collection_in_cr},'${movie_genre}',${movie_rating});
    `
    const res=await db.run(query)
    const newId=res.lastID
    response.send({'newmovieid':newId})
})



//update a movie


app.put("/movies/:id/",async (request,response)=>{
    const {id}=request.params
    const movie_details=request.body
    const {movie_name,movie_collection_in_cr,movie_genre,movie_rating}=movie_details
    const query=`update movies
    set movie_name='${movie_name}',
    movie_collection_in_cr=${movie_collection_in_cr},
    movie_genre='${movie_genre}',
    movie_rating=${movie_rating}
    where movie_id = ${id};
    `
    const res=await db.run(query)
    response.send('updated successfully...')
})